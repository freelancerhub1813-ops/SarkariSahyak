import React, { useEffect, useState } from "react";
import { FaTimes, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import "../styles/AdminDashboard.css";
import { createPortal } from "react-dom";
import { useI18n } from "../contexts/I18nContext";
import { translateScheme } from "../utils/translator";

function SchemeDetailsModal({ schemeId, onClose, initialApplyOpen = false }) {
  const { lang } = useI18n();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQId, setCurrentQId] = useState(null);
  const [eligibilityResult, setEligibilityResult] = useState(null); // 'eligible' | 'not_eligible'
  const [showEligModal, setShowEligModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]); // array of URLs
  const [thankYou, setThankYou] = useState(false);
  const [applicantAge, setApplicantAge] = useState("");

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
        const localized = await translateScheme(s.data, lang);
        setScheme(localized);
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
  }, [schemeId, lang]);

  // Apply flow handlers (component scope)
  const openApply = () => {
    setApplicantName("");
    setUploadedDocs([]);
    setThankYou(false);
    setShowApplyModal(true);
  };

  const handleUploadDocs = async (files) => {
    const email = localStorage.getItem('email') || '';
    const name = applicantName || (email && email.split('@')[0]) || 'user';
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (let i = 0; i < files.length; i++) {
        if (typeof FormData === 'undefined') { throw new Error('FormData not supported'); }
        const fd = new FormData();
        fd.append('document', files[i]);
        fd.append('user_email', email);
        fd.append('user_name', name);
        const res = await axios.post('http://localhost:9000/upload/document', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res?.data?.path) uploaded.push(res.data.path);
      }
      setUploadedDocs((prev) => [...prev, ...uploaded]);
    } catch (e) {
      console.error('Upload failed', e);
      alert('Failed to upload document(s). Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const submitApplication = async () => {
    const email = localStorage.getItem('email');
    if (!email) { alert('Please login before applying.'); return; }
    try {
      await axios.post('http://localhost:9000/apply-scheme', {
        user_email: email,
        scheme_id: schemeId,
        applied_documents: uploadedDocs.join(','),
        application_notes: `Applicant: ${applicantName || 'N/A'} | Age: ${applicantAge || 'N/A'}`,
      });
      setThankYou(true);
      // Auto-close after short delay
      setTimeout(() => {
        setShowApplyModal(false);
      }, 1500);
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data || e?.message || 'Failed to submit application.';
      alert(msg);
    }
  };

  // Open Apply modal directly if requested
  useEffect(() => {
    if (initialApplyOpen) {
      setShowApplyModal(true);
    }
  }, [initialApplyOpen]);

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
    // If terminal, mark eligible immediately
    if (terminal) {
      setEligibilityResult('eligible');
      setCurrentQId(null);
      return;
    }
    // If explicit pointer is provided, try to use it (by id first, then by sort_order)
    if (nextId != null) {
      const nextById = questions.find(q2 => q2.id === nextId);
      if (nextById) { setCurrentQId(nextById.id); return; }
      const nextByOrder = questions.find(q2 => q2.sort_order === nextId);
      if (nextByOrder) { setCurrentQId(nextByOrder.id); return; }
      console.warn('Next question not found for pointer:', nextId, 'available:', questions.map(q => ({id:q.id, order:q.sort_order})));
      // If pointer broken, fall through to auto-advance by sort order
    }
    // Simpler flow: auto-advance to the next higher sort_order question, if any
    const currentOrder = q.sort_order;
    const candidates = questions
      .filter(q2 => q2.sort_order > currentOrder)
      .sort((a, b) => a.sort_order - b.sort_order);
    if (candidates.length > 0) {
      setCurrentQId(candidates[0].id);
      return;
    }
    // No further questions -> eligible
    setEligibilityResult('eligible');
    setCurrentQId(null);
  };

  if (!schemeId) return null;

  return (
    <>
      {typeof document !== 'undefined' && createPortal(
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

              <div style={{ display: 'flex', gap: 10 }}>
                {questions.length > 0 && (
                  <button className="btn-primary" onClick={startEligibility}>Eligibility Checker</button>
                )}
                <button className="btn-secondary" onClick={openApply}>Apply Scheme</button>
              </div>
            </div>
          </div>
        </div>, document.body)}

      {showEligModal && typeof document !== 'undefined' && createPortal(
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

      {showApplyModal && typeof document !== 'undefined' && createPortal(
        <div className="modal-backdrop" onClick={() => setShowApplyModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Apply for Scheme</h3>
              <button className="icon-btn" onClick={() => setShowApplyModal(false)} aria-label="Close"><FaTimes /></button>
            </div>
            <div className="modal-body" style={{ display: 'grid', gap: 10 }}>
              <div style={{ fontWeight: 700 }}>Enter your details</div>
              <label>
                Your Name
                <input className="input" value={applicantName} onChange={(e) => setApplicantName(e.target.value)} placeholder="Enter your full name" />
              </label>
              <label>
                Your Age
                <input className="input" type="number" min="0" value={applicantAge} onChange={(e) => setApplicantAge(e.target.value)} placeholder="Enter your age" />
              </label>
              <label>
                Upload Documents
                <input type="file" multiple onChange={(e) => handleUploadDocs(e.target.files)} />
              </label>
              {uploading && <div>Uploading...</div>}
              {uploadedDocs.length > 0 && (
                <div style={{ fontSize: 12, color: '#374151' }}>
                  Uploaded:
                  <ul>
                    {uploadedDocs.map((u, i) => (
                      <li key={i}><a href={u} target="_blank" rel="noreferrer">{u}</a></li>
                    ))}
                  </ul>
                </div>
              )}
              {thankYou && (
                <div style={{ color: '#16a34a', fontWeight: 700 }}>Thank you for submitting your application.</div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={submitApplication} disabled={uploading}>Submit Application</button>
            </div>
          </div>
        </div>, document.body)}
    </>
  );
}
export default SchemeDetailsModal;
