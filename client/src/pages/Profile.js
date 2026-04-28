import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Profile.css";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    branch: user?.branch || "",
    skills: user?.skills?.join(", ") || "",
    resumeLink: user?.resumeLink || "",
    phone: user?.phone || "",
    linkedIn: user?.linkedIn || "",
    github: user?.github || "",
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [jobOpenings, setJobOpenings] = useState([]);
  const [jobLoading, setJobLoading] = useState(true);

  useEffect(() => {
    const fetchJobOpenings = async () => {
      try {
        const { data } = await api.get("/job-openings");
        setJobOpenings(data);
      } catch (error) {
        console.error("Failed to fetch job openings", error);
      } finally {
        setJobLoading(false);
      }
    };

    fetchJobOpenings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const submitData = {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s)
      };
      await updateProfile(submitData);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page animate-fade-in">
      <div className="page-header">
        <h1>My Profile</h1>
        <p className="text-muted">Manage your personal and professional details</p>
      </div>

      <div className="glass-card profile-card">
        {message && (
          <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h3 className="section-title">Personal Details</h3>
          <div className="d-flex gap-4 mb-4">
            <div className="form-group flex-1">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} disabled />
            </div>
          </div>

          <div className="d-flex gap-4 mb-4">
            <div className="form-group flex-1">
              <label className="form-label">Branch / Course</label>
              <input type="text" className="form-control" name="branch" value={formData.branch} onChange={handleChange} />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">Phone Number</label>
              <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <h3 className="section-title mt-4">Professional Details</h3>
          <div className="form-group mb-4">
            <label className="form-label">Skills (Comma separated)</label>
            <input type="text" className="form-control" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python" />
          </div>

          <div className="d-flex gap-4 mb-4">
            <div className="form-group flex-1">
              <label className="form-label">LinkedIn URL</label>
              <input type="url" className="form-control" name="linkedIn" value={formData.linkedIn} onChange={handleChange} />
            </div>
            <div className="form-group flex-1">
              <label className="form-label">GitHub URL</label>
              <input type="url" className="form-control" name="github" value={formData.github} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Resume / Portfolio Link</label>
            <input type="url" className="form-control" name="resumeLink" value={formData.resumeLink} onChange={handleChange} />
          </div>

          <div className="mt-4">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <div className="glass-card profile-card mt-4">
        <h3 className="section-title">Available Job Openings</h3>
        {jobLoading ? (
          <p className="text-muted">Loading openings...</p>
        ) : jobOpenings.length > 0 ? (
          <div className="openings-list">
            {jobOpenings.map((opening) => (
              <article key={opening._id} className="opening-card">
                <div className="opening-head">
                  <h4>{opening.title}</h4>
                  <span className="badge" style={{ textTransform: "capitalize" }}>
                    {opening.type}
                  </span>
                </div>
                <p className="text-muted opening-company">{opening.company}</p>
                <p className="text-muted">{opening.location || "Location not specified"}</p>
                {opening.description && <p>{opening.description}</p>}
                <div className="opening-meta">
                  <span>
                    Deadline:{" "}
                    {opening.deadline
                      ? new Date(opening.deadline).toLocaleDateString()
                      : "Not specified"}
                  </span>
                  {opening.applyLink && (
                    <a href={opening.applyLink} target="_blank" rel="noreferrer" className="btn btn-outline text-sm">
                      Apply
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted">No job openings posted yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
