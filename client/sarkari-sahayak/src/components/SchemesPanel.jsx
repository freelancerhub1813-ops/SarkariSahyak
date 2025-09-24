import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlusCircle, FaEdit, FaEye, FaTimes, FaTrash, FaPlus, FaFilter } from "react-icons/fa";
import "../styles/AdminDashboard.css";

function SchemesPanel({ onAdd, onUpdate, onView }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showViewForm, setShowViewForm] = useState(false);
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  // Eligibility manager state
  const [showEligibilityMgr, setShowEligibilityMgr] = useState(false);
  const [eligCategory, setEligCategory] = useState("");
  const [eligSchemes, setEligSchemes] = useState([]);
  const [eligSelectedScheme, setEligSelectedScheme] = useState(null);
  const [schemeQuestions, setSchemeQuestions] = useState([]);
  const [qSortOrder, setQSortOrder] = useState(1);
  const [qText, setQText] = useState("");
  const [qExpected, setQExpected] = useState("yes");
  const [qNextOnYes, setQNextOnYes] = useState("");
  const [qNextOnNo, setQNextOnNo] = useState("");
  const [qTerminalYes, setQTerminalYes] = useState(false);
  const [qTerminalNo, setQTerminalNo] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  // Form states
  const [schemeName, setSchemeName] = useState("");
  const [category, setCategory] = useState("");
  const [basicInfo, setBasicInfo] = useState("");
  const [docInput, setDocInput] = useState("");
  const [documents, setDocuments] = useState([]);
  const [objectives, setObjectives] = useState("");
  const [benefits, setBenefits] = useState("");
  const [eligibility, setEligibility] = useState("");

  // Load schemes on component mount
  useEffect(() => {
    loadSchemes();
  }, []);

  // Helper: match categories flexibly across different labels
  const matchesCategory = (dbCat = "", sel = "") => {
    if (!sel) return true;
    const c = String(dbCat).toLowerCase();
    switch (sel) {
      case 'agriculture':
        return c === 'agriculture' || c.includes('agricult');
      case 'banking':
        return c.includes('bank') || c.includes('finance');
      case 'business':
        return c.includes('business') || c.includes('entrepreneur');
      case 'education':
        return c === 'education' || c.includes('educat');
      case 'health':
        return c === 'health' || c.includes('health');
      case 'it_science':
        return c === 'it_science' || (c.includes('it') && c.includes('science'));
      case 'women':
        return c.includes('women');
      default:
        return true;
    }
  };

  // Filter schemes when category changes
  useEffect(() => {
    if (selectedCategory === "") {
      setFilteredSchemes(schemes);
    } else {
      setFilteredSchemes(schemes.filter(scheme => matchesCategory(scheme.category, selectedCategory)));
    }
  }, [schemes, selectedCategory]);

  const loadSchemes = () => {
    axios.get("http://localhost:9000/schemes")
      .then((res) => {
        setSchemes(res.data);
      })
      .catch((err) => {
        console.error("Failed to load schemes:", err);
      });
  };

  const openAddForm = () => {
    setSelectedScheme(null);
    setSchemeName("");
    setCategory("");
    setBasicInfo("");
    setDocInput("");
    setDocuments([]);
    setObjectives("");
    setBenefits("");
    setEligibility("");
    setShowAddForm(true);
  };

  const openUpdateForm = (scheme) => {
    setSelectedScheme(scheme);
    setSchemeName(scheme.name);
    setCategory(scheme.category);
    setBasicInfo(scheme.basic_info || "");
    setDocuments(scheme.documents ? scheme.documents.split(",") : []);
    setObjectives(scheme.objectives || "");
    setBenefits(scheme.benefits || "");
    setEligibility(scheme.eligibility || "");
    setDocInput("");
    setShowUpdateForm(false); // Close the list modal
  };

  const openViewForm = () => {
    setSelectedCategory("");
    setShowViewForm(true);
  };

  const openEligibilityMgr = () => {
    setEligCategory("");
    setEligSchemes([]);
    setEligSelectedScheme(null);
    setSchemeQuestions([]);
    setQSortOrder(1);
    setQText("");
    setQExpected("yes");
    setQNextOnYes("");
    setQNextOnNo("");
    setQTerminalYes(false);
    setQTerminalNo(false);
    setEditingQuestionId(null);
    setShowEligibilityMgr(true);
    // load all schemes initially
    loadEligSchemes("");
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setSchemeName("");
    setCategory("");
    setBasicInfo("");
    setDocInput("");
    setDocuments([]);
    setObjectives("");
    setBenefits("");
    setEligibility("");
  };

  const closeUpdateForm = () => {
    setShowUpdateForm(false);
    setSelectedScheme(null);
    setSchemeName("");
    setCategory("");
    setBasicInfo("");
    setDocInput("");
    setDocuments([]);
    setObjectives("");
    setBenefits("");
    setEligibility("");
  };

  const closeViewForm = () => {
    setShowViewForm(false);
    setSelectedCategory("");
  };

  const closeEligibilityMgr = () => {
    setShowEligibilityMgr(false);
    setEligCategory("");
    setEligSchemes([]);
    setEligSelectedScheme(null);
    setSchemeQuestions([]);
    setEditingQuestionId(null);
  };

  const loadEligSchemes = (categoryFilter) => {
    axios.get("http://localhost:9000/schemes")
      .then((res) => {
        const all = res.data || [];
        const list = categoryFilter ? all.filter(s => matchesCategory(s.category, categoryFilter)) : all;
        setEligSchemes(list);
      })
      .catch((err) => console.error("Failed to load schemes:", err));
  };

  const onEligCategoryChange = (val) => {
    setEligCategory(val);
    setEligSelectedScheme(null);
    setSchemeQuestions([]);
    loadEligSchemes(val);
  };

  const selectEligScheme = (scheme) => {
    setEligSelectedScheme(scheme);
    // load questions for selected scheme
    axios.get(`http://localhost:9000/schemes/${scheme.id}/questions`)
      .then((res) => setSchemeQuestions(res.data || []))
      .catch(() => setSchemeQuestions([]));
  };

  const submitQuestion = (e) => {
    e.preventDefault();
    if (!eligSelectedScheme) { alert("Please select a scheme first"); return; }
    const sort_order = Number(qSortOrder) || 1;
    const question_text = qText.trim();
    const expected_answer = qExpected === 'no' ? 'no' : 'yes';
    const next_on_yes = qNextOnYes !== '' ? Number(qNextOnYes) : null;
    const next_on_no = qNextOnNo !== '' ? Number(qNextOnNo) : null;
    const is_terminal_yes = qTerminalYes ? 1 : 0;
    const is_terminal_no = qTerminalNo ? 1 : 0;

    // Simpler rule: Next pointers are optional. If left blank, flow will auto-advance to the next question by sort order.

    const payload = { sort_order, question_text, expected_answer, next_on_yes, next_on_no, is_terminal_yes, is_terminal_no };
    if (!payload.question_text) { alert("Please enter question text"); return; }

    const req = editingQuestionId
      ? axios.put(`http://localhost:9000/schemes/${eligSelectedScheme.id}/questions/${editingQuestionId}`, payload)
      : axios.post(`http://localhost:9000/schemes/${eligSelectedScheme.id}/questions`, payload);

    req
      .then(() => axios.get(`http://localhost:9000/schemes/${eligSelectedScheme.id}/questions`))
      .then((res) => {
        setSchemeQuestions(res.data || []);
        // reset minimal fields
        setQText("");
        setQSortOrder(1);
        setQExpected('yes');
        setQNextOnYes("");
        setQNextOnNo("");
        setQTerminalYes(false);
        setQTerminalNo(false);
        setEditingQuestionId(null);
      })
      .catch((err) => {
        console.error(err);
        alert((editingQuestionId ? "Failed to update question: " : "Failed to add question: ") + (err?.response?.data || err?.message || 'Unknown error'));
      });
  };

  const editQuestion = (q) => {
    setEditingQuestionId(q.id);
    setQSortOrder(q.sort_order ?? 1);
    setQText(q.question_text || "");
    setQExpected(q.expected_answer === 'no' ? 'no' : 'yes');
    setQNextOnYes(q.next_on_yes ?? "");
    setQNextOnNo(q.next_on_no ?? "");
    setQTerminalYes(!!q.is_terminal_yes);
    setQTerminalNo(!!q.is_terminal_no);
  };

  const cancelEditQuestion = () => {
    setEditingQuestionId(null);
    setQSortOrder(1);
    setQText("");
    setQExpected('yes');
    setQNextOnYes("");
    setQNextOnNo("");
    setQTerminalYes(false);
    setQTerminalNo(false);
  };

  const deleteQuestion = (q) => {
    if (!eligSelectedScheme) return;
    if (!window.confirm('Delete this question?')) return;
    axios.delete(`http://localhost:9000/schemes/${eligSelectedScheme.id}/questions/${q.id}`)
      .then(() => axios.get(`http://localhost:9000/schemes/${eligSelectedScheme.id}/questions`))
      .then((res) => setSchemeQuestions(res.data || []))
      .catch((err) => {
        console.error(err);
        alert('Failed to delete question: ' + (err?.response?.data || err?.message || 'Unknown error'));
      });
  };

  const addDocument = () => {
    const v = docInput.trim();
    if (!v) return;
    if (documents.includes(v)) return;
    setDocuments([...documents, v]);
    setDocInput("");
  };

  const removeDocument = (d) => {
    setDocuments(documents.filter(x => x !== d));
  };

  const submitForm = (e) => {
    e.preventDefault();
    const name = schemeName.trim();
    const info = basicInfo.trim();
    if (!name) { alert("Please enter scheme name"); return; }
    if (!category) { alert("Please select category"); return; }

    axios.post("http://localhost:9000/schemes", {
      name,
      category,
      basicInfo: info,
      objectives,
      benefits,
      eligibility,
      documents
    })
    .then(() => {
      alert("Scheme added successfully");
      closeAddForm();
      loadSchemes();
    })
    .catch((err) => {
      console.error(err);
      alert("Error: " + (err.response?.data || err.message));
    });
  };

  const updateForm = (e) => {
    e.preventDefault();
    const name = schemeName.trim();
    const info = basicInfo.trim();
    if (!name) { alert("Please enter scheme name"); return; }
    if (!category) { alert("Please select category"); return; }

    axios.put(`http://localhost:9000/schemes/${selectedScheme.id}`, {
      name,
      category,
      basicInfo: info,
      objectives,
      benefits,
      eligibility,
      documents
    })
    .then(() => {
      alert("Scheme updated successfully");
      closeUpdateForm();
      loadSchemes();
    })
    .catch((err) => {
      console.error(err);
      alert("Error: " + (err.response?.data || err.message));
    });
  };

  const deleteScheme = (schemeId, schemeName) => {
    if (window.confirm(`Are you sure you want to delete "${schemeName}"?`)) {
      axios.delete(`http://localhost:9000/schemes/${schemeId}`)
        .then(() => {
          alert("Scheme deleted successfully");
          closeUpdateForm();
          loadSchemes();
        })
        .catch((err) => {
          console.error(err);
          alert("Error: " + (err.response?.data || err.message));
        });
    }
  };

  const getCategoryDisplayName = (cat) => {
    const names = {
      agriculture: "Agriculture",
      banking: "Banking", 
      business: "Business",
      education: "Education",
      health: "Health",
      it_science: "IT & Science",
      women: "Women"
    };
    return names[cat] || cat;
  };

  return (
    <section className="schemes-wrap">
      <div className="schemes-header center">
        <h1 className="schemes-title">Schemes</h1>
        <p className="panel-subtext center-text">Add, update and view government schemes.</p>
      </div>

      <div className="panel-grid">
        <div className="panel-card simple">
          <div className="panel-icon icon-green">
            <FaPlusCircle />
          </div>
          <h3 className="panel-title">Add Scheme</h3>
          <p className="panel-desc">Create a new scheme with details and eligibility.</p>
          <button className="panel-btn" onClick={openAddForm}>Add Scheme</button>
        </div>

        <div className="panel-card simple">
          <div className="panel-icon icon-orange">
            <FaEdit />
          </div>
          <h3 className="panel-title">Update Scheme</h3>
          <p className="panel-desc">Edit an existing scheme's information.</p>
          <button className="panel-btn" onClick={() => setShowUpdateForm(true)}>Update Scheme</button>
        </div>

        <div className="panel-card simple">
          <div className="panel-icon icon-blue">
            <FaEye />
          </div>
          <h3 className="panel-title">View Schemes</h3>
          <p className="panel-desc">Browse and search all available schemes.</p>
          <button className="panel-btn" onClick={openViewForm}>View Schemes</button>
        </div>

        <div className="panel-card simple">
          <div className="panel-icon icon-blue">
            <FaFilter />
          </div>
          <h3 className="panel-title">Check Eligibility</h3>
          <p className="panel-desc">Manage eligibility questions per scheme.</p>
          <button className="panel-btn" onClick={openEligibilityMgr}>Open Manager</button>
        </div>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="modal-backdrop" onClick={closeAddForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add New Scheme</h3>
              <button className="icon-btn" onClick={closeAddForm} aria-label="Close">
                <FaTimes />
              </button>
            </div>

            <form className="modal-body" onSubmit={submitForm}>
              <div className="form-group">
                <label>Scheme Name</label>
                <input
                  type="text"
                  value={schemeName}
                  onChange={(e) => setSchemeName(e.target.value)}
                  placeholder="Enter scheme name"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  className="input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="banking">Banking</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="it_science">IT & Science</option>
                  <option value="women">Women</option>
                </select>
              </div>

              <div className="form-group">
                <label>Objectives</label>
                <textarea
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="List the objectives of the scheme"
                  rows={6}
                  className="textarea"
                />
              </div>

              <div className="form-group">
                <label>Benefits</label>
                <textarea
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="Detail the benefits provided"
                  rows={6}
                  className="textarea"
                />
              </div>

              <div className="form-group">
                <label>Eligibility</label>
                <textarea
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="Eligibility criteria"
                  rows={6}
                  className="textarea"
                />
              </div>

              <div className="form-group">
                <label>Required Documents</label>
                <div className="doc-input-row">
                  <input
                    type="text"
                    value={docInput}
                    onChange={(e) => setDocInput(e.target.value)}
                    placeholder="e.g., Aadhaar Card"
                    className="input"
                  />
                  <button type="button" className="add-doc-btn" onClick={addDocument}>
                    <FaPlus /> Add
                  </button>
                </div>

                {documents.length > 0 && (
                  <div className="doc-tags">
                    {documents.map((d) => (
                      <span key={d} className="doc-tag">
                        {d}
                        <button
                          type="button"
                          className="doc-remove"
                          onClick={() => removeDocument(d)}
                          aria-label={`Remove ${d}`}
                        >
                          <FaTrash />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeAddForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Form Modal - List */}
      {showUpdateForm && !selectedScheme && (
        <div className="modal-backdrop" onClick={closeUpdateForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update Scheme</h3>
              <button className="icon-btn" onClick={closeUpdateForm} aria-label="Close">
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="scheme-list">
                <h4>Select a scheme to update or delete:</h4>
                {schemes.map((scheme) => (
                  <div key={scheme.id} className="scheme-item">
                    <div className="scheme-info" onClick={() => openUpdateForm(scheme)}>
                      <h5>{scheme.name}</h5>
                      <p>Category: {getCategoryDisplayName(scheme.category)}</p>
                      <p>{scheme.basic_info}</p>
                    </div>
                    <div className="scheme-actions">
                      <button className="edit-btn" onClick={() => openUpdateForm(scheme)}>
                        <FaEdit />
                      </button>
                      <button 
                        className="delete-btn" 
                        onClick={() => deleteScheme(scheme.id, scheme.name)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Form - Edit */}
      {selectedScheme && (
        <div className="modal-backdrop" onClick={closeUpdateForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Update: {selectedScheme.name}</h3>
              <button className="icon-btn" onClick={closeUpdateForm} aria-label="Close">
                <FaTimes />
              </button>
            </div>

            <form className="modal-body" onSubmit={updateForm}>
              <div className="form-group">
                <label>Scheme Name</label>
                <input
                  type="text"
                  value={schemeName}
                  onChange={(e) => setSchemeName(e.target.value)}
                  placeholder="Enter scheme name"
                  className="input"
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  className="input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select category</option>
                  <option value="agriculture">Agriculture</option>
                  <option value="banking">Banking</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                  <option value="it_science">IT & Science</option>
                  <option value="women">Women</option>
                </select>
              </div>

              <div className="form-group">
                <label>Objectives</label>
                <textarea
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="List the objectives of the scheme"
                  rows={6}
                  className="textarea"
                />
              </div>

              <div className="form-group">
                <label>Benefits</label>
                <textarea
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  placeholder="Detail the benefits provided"
                  rows={6}
                  className="textarea"
                />
              </div>

              <div className="form-group">
                <label>Eligibility</label>
                <textarea
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="Eligibility criteria"
                  rows={6}
                  className="textarea"
                />
              </div>

              <div className="form-group">
                <label>Required Documents</label>
                <div className="doc-input-row">
                  <input
                    type="text"
                    value={docInput}
                    onChange={(e) => setDocInput(e.target.value)}
                    placeholder="e.g., Aadhaar Card"
                    className="input"
                  />
                  <button type="button" className="add-doc-btn" onClick={addDocument}>
                    <FaPlus /> Add
                  </button>
                </div>

                {documents.length > 0 && (
                  <div className="doc-tags">
                    {documents.map((d) => (
                      <span key={d} className="doc-tag">
                        {d}
                        <button
                          type="button"
                          className="doc-remove"
                          onClick={() => removeDocument(d)}
                          aria-label={`Remove ${d}`}
                        >
                          <FaTrash />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeUpdateForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Scheme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Eligibility Manager Modal */}
      {showEligibilityMgr && (
        <div className="modal-backdrop" onClick={closeEligibilityMgr}>
          <div className="modal view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Eligibility Manager</h3>
              <button className="icon-btn" onClick={closeEligibilityMgr} aria-label="Close">
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              {/* Filters */}
              <div className="filter-section">
                <div className="filter-controls">
                  <FaFilter className="filter-icon" />
                  <select
                    className="filter-select"
                    value={eligCategory}
                    onChange={(e) => onEligCategoryChange(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="banking">Banking</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="it_science">IT & Science</option>
                    <option value="women">Women</option>
                  </select>
                </div>
                <div className="scheme-count">
                  {eligSchemes.length} scheme{eligSchemes.length !== 1 ? 's' : ''} found
                </div>
                <button className="btn-secondary" onClick={() => loadEligSchemes(eligCategory)}>Refresh</button>
              </div>

              {/* Schemes list and questions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
                <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff' }}>
                  <div style={{ padding: 12, borderBottom: '1px solid #e5e7eb', fontWeight: 800 }}>Schemes</div>
                  <div style={{ maxHeight: 360, overflow: 'auto' }}>
                    {eligSchemes.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => selectEligScheme(s)}
                        style={{ padding: 10, cursor: 'pointer', background: eligSelectedScheme?.id === s.id ? '#eef2ff' : 'transparent' }}
                      >
                        <div style={{ fontWeight: 700 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{s.category}</div>
                      </div>
                    ))}
                    {eligSchemes.length === 0 && (
                      <div style={{ padding: 12, color: '#6b7280' }}>No schemes to show</div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff' }}>
                    <div style={{ padding: 12, borderBottom: '1px solid #e5e7eb', fontWeight: 800 }}>Existing Questions</div>
                    <div style={{ maxHeight: 220, overflow: 'auto', padding: 12 }}>
                      {eligSelectedScheme ? (
                        schemeQuestions.length > 0 ? (
                          <ol style={{ margin: 0, paddingLeft: 18 }}>
                            {schemeQuestions.map((q) => (
                              <li key={q.id} style={{ marginBottom: 8 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                                  <div>
                                    <div style={{ fontWeight: 700 }}>{q.question_text}</div>
                                    <div style={{ fontSize: 12, color: '#6b7280' }}>ID: {q.id}, order: {q.sort_order}, expected: {q.expected_answer}, next yes: {q.next_on_yes || '-'}, next no: {q.next_on_no || '-'}, terminalYes: {q.is_terminal_yes ? 'Y' : 'N'}, terminalNo: {q.is_terminal_no ? 'Y' : 'N'}</div>
                                  </div>
                                  <div style={{ display: 'flex', gap: 8 }}>
                                    <button type="button" className="btn-secondary" onClick={() => editQuestion(q)}>Edit</button>
                                    <button type="button" className="btn-secondary" onClick={() => deleteQuestion(q)}>Delete</button>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <div style={{ color: '#6b7280' }}>No questions yet. Add one below.</div>
                        )
                      ) : (
                        <div style={{ color: '#6b7280' }}>Select a scheme to view questions</div>
                      )}
                    </div>
                  </div>

                  <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, background: '#fff' }}>
                    <div style={{ padding: 12, borderBottom: '1px solid #e5e7eb', fontWeight: 800 }}>{editingQuestionId ? 'Edit Question' : 'Add Question'}</div>
                    <form style={{ padding: 12, display: 'grid', gap: 10 }} onSubmit={submitQuestion}>
                      <div>
                        <label style={{ fontWeight: 700 }}>Sort Order</label>
                        <input className="input" type="number" value={qSortOrder} onChange={(e) => setQSortOrder(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontWeight: 700 }}>Question Text</label>
                        <textarea className="textarea" rows={3} value={qText} onChange={(e) => setQText(e.target.value)} placeholder="Enter a yes/no question" />
                      </div>
                      <div>
                        <label style={{ fontWeight: 700 }}>Expected Answer</label>
                        <select className="input" value={qExpected} onChange={(e) => setQExpected(e.target.value)}>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <label style={{ fontWeight: 700 }}>Next on Yes (Question ID) — optional</label>
                          <input className="input" type="number" value={qNextOnYes} onChange={(e) => setQNextOnYes(e.target.value)} placeholder="leave blank to auto-go to next question" />
                        </div>
                        <div>
                          <label style={{ fontWeight: 700 }}>Next on No (Question ID) — optional</label>
                          <input className="input" type="number" value={qNextOnNo} onChange={(e) => setQNextOnNo(e.target.value)} placeholder="leave blank to auto-go to next question" />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input type="checkbox" checked={qTerminalYes} onChange={(e) => setQTerminalYes(e.target.checked)} /> Terminal on Yes
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input type="checkbox" checked={qTerminalNo} onChange={(e) => setQTerminalNo(e.target.checked)} /> Terminal on No
                        </label>
                      </div>
                      <div className="modal-footer" style={{ padding: 0, borderTop: 'none', background: 'transparent' }}>
                        <button type="button" className="btn-secondary" onClick={cancelEditQuestion}>{editingQuestionId ? 'Cancel' : 'Clear'}</button>
                        <button type="submit" className="btn-primary" disabled={!eligSelectedScheme}>{editingQuestionId ? 'Update Question' : 'Add Question'}</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Schemes Modal */}
      {showViewForm && (
        <div className="modal-backdrop" onClick={closeViewForm}>
          <div className="modal view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>View Schemes</h3>
              <button className="icon-btn" onClick={closeViewForm} aria-label="Close">
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="filter-section">
                <div className="filter-controls">
                  <FaFilter className="filter-icon" />
                  <select
                    className="filter-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="banking">Banking</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="health">Health</option>
                    <option value="it_science">IT & Science</option>
                    <option value="women">Women</option>
                  </select>
                </div>
                <div className="scheme-count">
                  {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''} found
                </div>
              </div>

              <div className="schemes-grid">
                {filteredSchemes.length === 0 ? (
                  <div className="no-schemes">
                    <p>No schemes found for the selected category.</p>
                  </div>
                ) : (
                  filteredSchemes.map((scheme) => (
                    <div key={scheme.id} className="scheme-card">
                      <div className="scheme-card-header">
                        <h4>{scheme.name}</h4>
                        <span className="category-badge">{getCategoryDisplayName(scheme.category)}</span>
                      </div>
                      <div className="scheme-card-body">
                        <p className="scheme-description">{scheme.basic_info}</p>
                        {scheme.documents && (
                          <div className="scheme-documents">
                            <strong>Required Documents:</strong>
                            <ul>
                              {scheme.documents.split(",").map((doc, index) => (
                                <li key={index}>{doc.trim()}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default SchemesPanel;