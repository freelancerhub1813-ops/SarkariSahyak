import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaFilter, FaEnvelope, FaCheck, FaTimes, FaEye } from "react-icons/fa";
import "../styles/AdminDashboard.css";

function ApplicationsPanel() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("");
  const [scheme, setScheme] = useState("");
  const [status, setStatus] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);
  const [toast, setToast] = useState(null); // { text, type }

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("http://localhost:9000/all-applications")
      .then((res) => {
        setApps(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to load applications:", err);
        setError("Failed to load applications");
      })
      .finally(() => setLoading(false));
  }, [refreshTick]);

  const categories = useMemo(() => Array.from(new Set(apps.map(a => a.scheme_category))).filter(Boolean), [apps]);
  const schemes = useMemo(() => {
    const filtered = category ? apps.filter(a => a.scheme_category === category) : apps;
    return Array.from(new Set(filtered.map(a => a.scheme_name))).filter(Boolean);
  }, [apps, category]);

  const filtered = useMemo(() => {
    return apps.filter(a => {
      if (category && a.scheme_category !== category) return false;
      if (scheme && a.scheme_name !== scheme) return false;
      if (status && a.application_status !== status) return false;
      return true;
    });
  }, [apps, category, scheme, status]);

  const setAppStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:9000/application-status/${id}`, { status: newStatus, admin_notes: "" });
      const msg = res?.data?.message || `Status updated to ${newStatus}`;
      setToast({ text: msg, type: 'success' });
      setTimeout(() => setToast(null), 2000);
      setRefreshTick((x) => x + 1);
    } catch (e) {
      console.error(e);
      setToast({ text: 'Failed to update status', type: 'error' });
      setTimeout(() => setToast(null), 2500);
    }
  };

  const sendMail = async (id) => {
    try {
      const res = await axios.post(`http://localhost:9000/notify-application/${id}`);
      const msg = res?.data?.message || 'Mail processed';
      setToast({ text: msg, type: 'success' });
      setTimeout(() => setToast(null), 2000);
    } catch (e) {
      console.error(e);
      setToast({ text: 'Failed to send email', type: 'error' });
      setTimeout(() => setToast(null), 2500);
    }
  };

  const prettyStatus = (s) => {
    switch (s) {
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "under_review": return "Under Review";
      default: return "Pending";
    }
  };

  return (
    <section className="schemes-wrap">
      <div className="schemes-header center">
        <h1 className="schemes-title">Applications</h1>
        <p className="panel-subtext center-text">Review and manage user applications.</p>
      </div>

      <div className="panel-card simple" style={{ padding: 16 }}>
        <div className="panel-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <FaFilter /> Filters
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 8, marginTop: 10 }}>
          <select className="input" value={category} onChange={(e) => { setCategory(e.target.value); setScheme(""); }}>
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="input" value={scheme} onChange={(e) => setScheme(e.target.value)}>
            <option value="">All Schemes</option>
            {schemes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="btn-secondary" onClick={() => setRefreshTick((x)=>x+1)}>Refresh</button>
        </div>
      </div>

      {loading && <div style={{ padding: 16 }}>Loading applications...</div>}
      {error && <div style={{ padding: 16, color: '#dc2626' }}>{error}</div>}

      {!loading && !error && (
        <div style={{ marginTop: 12, border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr 220px 240px', gap: 8, padding: 10, fontWeight: 800, borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
            <div>User (Email)</div>
            <div>Scheme</div>
            <div>Category</div>
            <div>Status</div>
            <div>Documents</div>
            <div>Actions</div>
          </div>
          <div style={{ maxHeight: 480, overflow: 'auto' }}>
            {filtered.map((a) => (
              <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr 1fr 220px 240px', gap: 8, padding: 10, borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
                <div>{a.user_email}</div>
                <div>{a.scheme_name}</div>
                <div>{a.scheme_category}</div>
                <div>{prettyStatus(a.application_status)}</div>
                <div style={{ fontSize: 12 }}>
                  {String(a.applied_documents || '')
                    .split(',')
                    .filter(x => x && x.trim())
                    .map((u, i) => (
                      <div key={i}><a href={u} target="_blank" rel="noreferrer">Doc {i+1}</a></div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button className="btn-secondary" title="Under Review" onClick={() => setAppStatus(a.id, 'under_review')}><FaEye /> Under Review</button>
                  <button className="btn-secondary" title="Approve" onClick={() => setAppStatus(a.id, 'approved')}><FaCheck /> Approve</button>
                  <button className="btn-secondary" title="Reject" onClick={() => setAppStatus(a.id, 'rejected')}><FaTimes /> Reject</button>
                  <button className="btn-secondary" title="Send Mail" onClick={() => sendMail(a.id)}><FaEnvelope /> Send Mail</button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 12, color: '#6b7280' }}>No applications found for selected filters.</div>
            )}
          </div>
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', right: 16, bottom: 16, minWidth: 280,
          background: toast.type === 'error' ? '#fee2e2' : '#ecfeff',
          color: toast.type === 'error' ? '#991b1b' : '#0c4a6e',
          border: `1px solid ${toast.type === 'error' ? '#fecaca' : '#a5f3fc'}`,
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
          padding: '12px 14px', borderRadius: 10, zIndex: 9999
        }}>
          {toast.text}
        </div>
      )}
    </section>
  );
}

export default ApplicationsPanel;
