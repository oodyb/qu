"use client";
import React from "react";
import toast from "react-hot-toast";
import { useState } from "react";
import "../../styles/admin_dashboard.css";

// Popup to create class
export default function CreateClassModal({ onClose, allCourses, instructors, onClassCreated }) {
    const [formData, setFormData] = useState({ id: "", courseId: "", instructorId: "", status: "", capacity: 1, room: "", days: "", time: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const schedule = { room: formData.room, day: formData.days.split(",").map(d => d.trim()), time: formData.time };
        const payload = {
            id: formData.id,
            courseId: formData.courseId,
            instructorId: parseInt(formData.instructorId, 10),
            status: formData.status,
            capacity: parseInt(formData.capacity, 10),
            schedule,
        };

        const res = await fetch("/api/admin/create-class", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            toast.success("Class created successfully");
            onClassCreated();
            onClose();
        } else { toast.error("Failed to create class"); }
    };

    function isValidTimeRange(input) {
        const pattern = /^\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}$/;
        return pattern.test(input);
    }

    return (
        <div className="adm-modal-overlay">
            <div className="adm-modal">
                <div className="adm-modal-header">
                    <h2>Create New Class</h2>
                    <button className="adm-modal-close" onClick={onClose}>✖</button>
                </div>
                <form className="adm-form" onSubmit={handleSubmit}>
                    <div className="adm-form-group">
                        <label>Class ID:</label>
                        <input type="text" placeholder="L01" required onChange={(e) => setFormData({ ...formData, id: e.target.value })} />
                    </div>
                    <div className="adm-form-group">
                        <label>Course:</label>
                        <select required value={formData.courseId}
                            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                        >
                            <option value="" disabled>Select</option>

                            {allCourses.map(course => (
                                <option key={course.id} value={course.id}>{course.id} – {course.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="adm-form-group">
                        <label>Instructor:</label>
                        <select
                            value={formData.instructorId}
                            onChange={(e) => setFormData({ ...formData, instructorId: e.target.value })}
                        >
                            <option value="" disabled>Select</option>
                            {instructors.map((instructor) => (
                                <option key={instructor.id} value={instructor.id}>
                                    {instructor.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="adm-form-group">
                        <label>Status:</label>
                        <select required value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option value="" disabled>Select</option>
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN PROGRESS</option>
                            <option value="COMPLETED">COMPLETED</option>
                        </select>
                    </div>
                    <div className="adm-form-group">
                        <label>Capacity:</label>
                        <input type="number" placeholder="20" required value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        />
                    </div>
                    <div className="adm-form-group">
                        <label>Room:</label>
                        <input type="text" placeholder="B102" required value={formData.room || ""}
                            onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                        />
                    </div>
                    <div className="adm-form-group">
                        <label>Days (comma separated):</label>
                        <input type="text" placeholder="Sunday, Tuesday" required value={formData.days}
                            onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                        />
                    </div>
                    <div className="adm-form-group">
                        <label>Time:</label>
                        <input type="text" placeholder="8:00 - 13:00" required value={formData.time}
                            onChange={(e) => {
                                setFormData({ ...formData, time: e.target.value });
                                if (!isValidTimeRange(e.target.value)) { toast.error("Input doesn't match time format"); }
                            }}
                        />
                    </div>
                    <button type="submit" className="adm-btn-validate">Create Class</button>
                </form>
            </div>
        </div>
    );
}