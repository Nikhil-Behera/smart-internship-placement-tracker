import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    shortlisted: 0,
    interview: 0,
    placed: 0,
    rejected: 0
  });
  const [recentApps, setRecentApps] = useState([]);
  const [jobOpenings, setJobOpenings] = useState([]);
  const [jobPosting, setJobPosting] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "placement",
    deadline: "",
    applyLink: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    const statsRes = await api.get("/applications/stats");
    setStats(statsRes.data);

    const appsRes = await api.get("/applications");
    // Just take top 5 recent applications
    setRecentApps(appsRes.data.slice(0, 5));
  };

  const fetchJobOpenings = async () => {
    const openingsRes = await api.get("/job-openings");
    setJobOpenings(openingsRes.data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchDashboardData();
        if (user?.role === "admin") {
          await fetchJobOpenings();
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.role]);

  const handleDeleteRecent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      await api.delete(`/applications/${id}`);
      await fetchDashboardData();
    } catch (error) {
      console.error("Failed to delete application", error);
    }
  };

  const handleJobInputChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleCreateJobOpening = async (e) => {
    e.preventDefault();
    setJobPosting(true);

    try {
      await api.post("/job-openings", jobForm);
      setJobForm({
        title: "",
        company: "",
        location: "",
        type: "placement",
        deadline: "",
        applyLink: "",
        description: "",
      });
      await fetchJobOpenings();
    } catch (error) {
      console.error("Failed to create job opening", error);
    } finally {
      setJobPosting(false);
    }
  };

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  return (
    <div className="dashboard animate-fade-in">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p className="text-muted">Track your placement journey at a glance</p>
      </div>

      <div className="stats-grid">
        <div className="glass-card stat-card">
          <h3>Total Applications</h3>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="glass-card stat-card">
          <h3>Applied</h3>
          <div className="stat-value text-info">{stats.applied}</div>
        </div>
        <div className="glass-card stat-card">
          <h3>Shortlisted</h3>
          <div className="stat-value text-purple">{stats.shortlisted}</div>
        </div>
        <div className="glass-card stat-card">
          <h3>Interviews</h3>
          <div className="stat-value text-warning">{stats.interview}</div>
        </div>
        <div className="glass-card stat-card">
          <h3>Placed</h3>
          <div className="stat-value text-success">{stats.placed}</div>
        </div>
      </div>

      <div className="recent-section glass-card mt-4">
        <div className="d-flex justify-between align-center mb-4">
          <h2>Recent Applications</h2>
          <Link to="/applications" className="btn btn-outline">View All</Link>
        </div>

        {recentApps.length > 0 ? (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app._id}>
                    <td><strong>{app.company}</strong></td>
                    <td>{app.role}</td>
                    <td>{new Date(app.appliedDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${app.status}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger text-sm"
                        onClick={() => handleDeleteRecent(app._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p className="text-muted">No applications found. Start tracking your journey!</p>
            <Link to="/applications" className="btn btn-primary mt-2">Add Application</Link>
          </div>
        )}
      </div>

      {user?.role === "admin" && (
        <div className="glass-card mt-4">
          <h2 className="mb-4">Add New Job Opening</h2>
          <form onSubmit={handleCreateJobOpening}>
            <div className="d-flex gap-3">
              <div className="form-group flex-1">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={jobForm.title}
                  onChange={handleJobInputChange}
                  required
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  value={jobForm.company}
                  onChange={handleJobInputChange}
                  required
                />
              </div>
            </div>

            <div className="d-flex gap-3">
              <div className="form-group flex-1">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={jobForm.location}
                  onChange={handleJobInputChange}
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Type</label>
                <select
                  className="form-control"
                  name="type"
                  value={jobForm.type}
                  onChange={handleJobInputChange}
                >
                  <option value="internship">Internship</option>
                  <option value="placement">Placement</option>
                </select>
              </div>
            </div>

            <div className="d-flex gap-3">
              <div className="form-group flex-1">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="form-control"
                  name="deadline"
                  value={jobForm.deadline}
                  onChange={handleJobInputChange}
                />
              </div>
              <div className="form-group flex-1">
                <label className="form-label">Apply Link</label>
                <input
                  type="url"
                  className="form-control"
                  name="applyLink"
                  value={jobForm.applyLink}
                  onChange={handleJobInputChange}
                  placeholder="https://"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                name="description"
                value={jobForm.description}
                onChange={handleJobInputChange}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={jobPosting}>
              {jobPosting ? "Posting..." : "Post Job Opening"}
            </button>
          </form>

          <div className="mt-4">
            <h3 className="mb-4">Recently Posted Openings</h3>
            {jobOpenings.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Company</th>
                      <th>Type</th>
                      <th>Deadline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobOpenings.slice(0, 5).map((opening) => (
                      <tr key={opening._id}>
                        <td>{opening.title}</td>
                        <td>{opening.company}</td>
                        <td style={{ textTransform: "capitalize" }}>{opening.type}</td>
                        <td>
                          {opening.deadline
                            ? new Date(opening.deadline).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">No job openings posted yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
