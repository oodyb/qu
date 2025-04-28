"use client";
import React from "react";
import "../../styles/admin_dashboard.css";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function ApproveInstructorModal({ onClose }) {
  const [preferences, setPreferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigned, setAssigned] = useState({});
  const [rejected, setRejected] = useState({});

  useEffect(() => {
    fetch("/api/admin/preferences")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPreferences(data);
        } else {
          console.error("Expected array but got:", data);
          setPreferences([]);
        }
      })
      .catch(err => {
        console.error("Failed to load preferences", err);
        setPreferences([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReject = async (preferenceId) => {
    const res = await fetch("/api/admin/preferences/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferenceId }),
    });

    if (res.ok) {
      setRejected(prev => ({ ...prev, [preferenceId]: true }));
    } else {
      toast.e("Failed to reject preference");
    }
  };

  const handleAssign = async (preferenceId, classId, courseId) => {
    const res = await fetch("/api/admin/preferences/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferenceId, classId, courseId }),
    });

    if (res.ok) {
      setAssigned(prev => ({ ...prev, [classId]: true }));
      toast.success("Instructor assigned successfully");
    } else {
      toast.error("Failed to assign instructor");
    }
  };

  return (
    <div className="adm-modal-overlay">
      <div className="adm-inst-modal">
        <div className="adm-modal-header">
          <h2>Approve Instructor Preferences</h2>
          <button className="adm-modal-close" onClick={onClose}>✖</button>
        </div>

        <div className="adm-modal-body">
          {loading ? (
            <p>Loading...</p>
          ) : preferences.length === 0 ? (
            <p>No preferences submitted.</p>
          ) : (
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Course</th>
                  <th>Class</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {preferences.map((pref, i) => (
                  <tr key={i}>
                    <td>{pref.instructor.name}</td>
                    <td>{pref.class.course.name}</td>
                    <td>{pref.classId || "N/A"}</td>
                    <td>
                      {assigned[pref.classId] ? (
                        <span className="adm-chip">Assigned</span>
                      ) : rejected[pref.id] ? (
                        <span className="adm-chip adm-chip-red">Rejected</span>
                      ) : (
                        <>
                          <button
                            className="adm-btn-validate"
                            onClick={() => handleAssign(pref.id, pref.classId, pref.courseId)}
                          >
                            Approve
                          </button>
                          <button
                            className="adm-btn-cancel"
                            onClick={() => handleReject(pref.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}