import React, { useEffect, useState } from "react";
import { FaTimes, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import "../styles/AdminDashboard.css";
import { createPortal } from "react-dom";

function SchemeDetailsModal({ schemeId, onClose }) {
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQId, setCurrentQId] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null); // 'eligible' | 'not_eligible'
  const [showEligModal, setShowEligModal] = useState(false);

  useEffect(() => {
    if (!schemeId) return;
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Load scheme first (required)
        const s = await axios.get(`http://localhost:9000/schemes/${schemeId}`);
        if (!isMounted) return;
        setScheme(s.data);
      } catch (e) {
        if (!isMounted) return;
        setError("Failed to load scheme details");
        setLoading(false);
        return; // do not proceed to questions if scheme failed
      }

      // Load questions (optional). If it fails, do not block the details UI
      try {
        const q = await axios.get(`http://localhost:9000/schemes/${schemeId}/questions`);
        if (!isMounted) return;
        setQuestions(q.data || []);
      } catch (e) {
        if (!isMounted) return;
        setQuestions([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();

    return () => {
      isMounted = false;
    };
  }, [schemeId]);

  const startEligibility = () => {
    if (questions.length === 0) return;
    setEligibilityResult(null);
    // Start with first by sort order
    setCurrentQId(questions[0].id);
    setShowEligModal(true);
  };

  const getCurrentQuestion = () => questions.find((q) => q.id === currentQId);

  const answer = (value) => {
    const q = getCurrentQuestion();
    if (!q) return;
    const isYes = value === 'yes';
    const nextId = isYes ? q.next_on_yes : q.next_on_no;
    const terminal = isYes ? q.is_terminal_yes : q.is_terminal_no;
    const expected = q.expected_answer; // 'yes' | 'no'

    // Only continue if the answer matches expected; else, immediately not eligible
    const ok = (value === expected);
    if (!ok) {
      setEligibilityResult('not_eligible');
      setCurrentQId(null);
      return;
    }
    // If terminal or no next question, mark eligible
    if (terminal || nextId == null) {
      setEligibilityResult('eligible');
      setCurrentQId(null);
      return;
    }
    // Resolve next question: prefer by id, fallback to sort_order match
    const nextById = questions.find(q2 => q2.id === nextId);
    if (nextById) {
      setCurrentQId(nextById.id);
      return;
    }
    const nextByOrder = questions.find(q2 => q2.sort_order === nextId);
    if (nextByOrder) {
      setCurrentQId(nextByOrder.id);
      return;
    }
    console.warn('Next question not found for pointer:', nextId, 'available:', questions.map(q => ({id:q.id, order:q.sort_order})));
    // If we can't resolve, stop flow gracefully as eligible (since current was correct & non-terminal but broken link)
    setEligibilityResult('eligible');
    setCurrentQId(null);
  };

  if (!schemeId) return null;

  return (
    <>
      {createPortal(
        <div className="modal-backdrop" onClick={onClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{scheme?.name || 'Scheme Details'}</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Close"><FaTimes /></button>
            </div>
            <div className="modal-body">
              {loading && <div>Loading...</div>}
              {error && <div style={{ color: '#dc2626' }}>{error}</div>}
              {scheme && (
                <div>
                  <div style={{ marginBottom: 8, color: '#374151' }}><strong>Category:</strong> <span>{({
                    agriculture: 'Agriculture',
                    banking: 'Banking',
                    business: 'Business',
                    education: 'Education',
                    health: 'Health',
                    it_science: 'IT & Science',
                    women: 'Women',
                  }[scheme.category]) || scheme.category}</span></div>
                  {scheme.objectives && (
                    <div style={{ marginTop: 12, padding: 12, background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}><strong>Objectives</strong><p>{scheme.objectives}</p></div>
                  )}
                  {scheme.benefits && (
                    <div style={{ marginTop: 12, padding: 12, background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}><strong>Benefits</strong><p>{scheme.benefits}</p></div>
                  )}
                  {scheme.eligibility && (
                    <div style={{ marginTop: 12, padding: 12, background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}><strong>Eligibility</strong><p>{scheme.eligibility}</p></div>
                  )}
                  {scheme.basic_info && (
                    <div style={{ marginTop: 12, padding: 12, background: '#f9fafb', borderRadius: 10, border: '1px solid #e5e7eb' }}><strong>Notes</strong><p>{scheme.basic_info}</p></div>
                  )}
                  {scheme.documents && (
                    <div style={{ marginTop: 12, padding: 12, background: '#f1f5f9', borderRadius: 10, borderLeft: '4px solid #3b82f6' }}>
                      <strong>Required Documents</strong>
                      <ul>
                        {String(scheme.documents || '')
                          .split(',')
                          .filter((d) => d && d.trim())
                          .map((d, i) => <li key={i}>{d.trim()}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {questions.length > 0 && (
                <button className="btn-primary" onClick={startEligibility}>Eligibility Checker</button>
              )}
            </div>
          </div>
        </div>, document.body)}

      {showEligModal && createPortal(
        <div className="modal-backdrop" onClick={() => setShowEligModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Eligibility Checker</h3>
              <button className="icon-btn" onClick={() => setShowEligModal(false)} aria-label="Close"><FaTimes /></button>
            </div>
            <div className="modal-body">
              {currentQId && (
                <div style={{ marginTop: 12, padding: 12, border: '1px solid #e5e7eb', borderRadius: 10 }}>
                  <p style={{ margin: '0 0 10px' }}>{getCurrentQuestion()?.question_text}</p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-secondary" onClick={() => answer('yes')}>Yes</button>
                    <button className="btn-secondary" onClick={() => answer('no')}>No</button>
                  </div>
                </div>
              )}

              {eligibilityResult === 'eligible' && (
                <div style={{ marginTop: 12, color: '#16a34a', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}><FaCheckCircle /> You are eligible for this scheme.</div>
              )}
              {eligibilityResult === 'not_eligible' && (
                <div style={{ marginTop: 12, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}><FaTimesCircle /> You are not eligible for this scheme.</div>
              )}
            </div>
          </div>
        </div>, document.body)}
    </>
  );
}
export default SchemeDetailsModal;
