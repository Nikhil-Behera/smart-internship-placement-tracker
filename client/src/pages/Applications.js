import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./Dashboard.css"; // Reuse table styles



const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    type: "internship",
    status: "applied",
    location: "",
    stipend: "",
    notes: ""
  });
  const [editId, setEditId] = useState(null);
  const [similarWarning, setSimilarWarning] = useState("");

  useEffect(() => {
    if (!formData.company || formData.company.trim() === "") {
      setSimilarWarning("");
      return;
    }

    const typedLower = formData.company.toLowerCase().trim();
    const uniqueCompanies = [...new Set(applications.map(app => app.company))];
    
    const similar = uniqueCompanies.find(existing => {
      if (!existing) return false;
      const existingLower = existing.toLowerCase().trim();
      if (existingLower === typedLower) return false;
      return (existingLower.length > 3 && typedLower.includes(existingLower)) || 
             (typedLower.length > 3 && existingLower.includes(typedLower));
    });

    if (similar) {
      setSimilarWarning(`You may have already added this company as "${similar}"`);
    } else {
      setSimilarWarning("");
    }
  }, [formData.company, applications]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get("/applications");
      setApplications(data);
    } catch (error) {
      console.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setFormData({
      company: "", role: "", type: "internship", status: "applied", 
      location: "", stipend: "", notes: ""
    });
    setEditId(null);
    setShowModal(true);
  };

  const openEditModal = (app) => {
    setFormData({
      company: app.company, role: app.role, type: app.type, 
      status: app.status, location: app.location || "", 
      stipend: app.stipend || "", notes: app.notes || ""
    });
    setEditId(app._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/applications/${editId}`, formData);
      } else {
        await api.post("/applications", formData);
      }
      setShowModal(false);
      fetchApplications();
    } catch (error) {
      console.error("Failed to save application");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await api.delete(`/applications/${id}`);
        fetchApplications();
      } catch (error) {
        console.error("Failed to delete");
      }
    }
  };

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="applications-page animate-fade-in">
      <div className="page-header d-flex justify-between align-center">
        <div>
          <h1>Applications</h1>
          <p className="text-muted">Manage the pipeline of your opportunities</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>+ New Application</button>
      </div>

      <div className="glass-card">
        {applications.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td><strong>{app.company}</strong></td>
                    <td>{app.role}</td>
                    <td style={{textTransform: 'capitalize'}}>{app.type}</td>
                    <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${app.status}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn btn-outline text-sm" onClick={() => openEditModal(app)}>Edit</button>
                        <button className="btn btn-danger text-sm" onClick={() => handleDelete(app._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No applications logged yet.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="glass-card flex-1">
            <h2>{editId ? "Edit Application" : "New Application"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="d-flex gap-3">
                <div className="form-group flex-1">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    list="company-suggestions"
                    className="form-control"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    required
                  />
                  <datalist id="company-suggestions">
                    {[...new Set(applications.map(app => app.company))].map(company => (
                      <option key={company} value={company} />
                    ))}
                  </datalist>
                  {similarWarning && (
                    <div style={{ color: "#ffc107", fontSize: "0.85rem", marginTop: "4px" }}>
                      ⚠️ {similarWarning}
                    </div>
                  )}
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">Role</label>
                  <input type="text" className="form-control" name="role" value={formData.role} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="d-flex gap-3">
                <div className="form-group flex-1">
                  <label className="form-label">Type</label>
                  <select className="form-control" name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="internship">Internship</option>
                    <option value="placement">Full-time/Placement</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">Status</label>
                  <select className="form-control" name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview">Interview</option>
                    <option value="placed">Placed (Offer)</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea className="form-control" name="notes" value={formData.notes} onChange={handleInputChange} rows="3"></textarea>
              </div>

              <div className="d-flex justify-between mt-4">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
