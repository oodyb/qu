"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import "../../styles/admin_dashboard.css";

// Popup to create a course
export default function CreateCourseModal({ onClose, allCourses, onCourseCreated }) {
    const [newCourse, setNewCourse] = useState(
        {
            id: "",
            name: "",
            category: [],
            categoryInput: "",
            prerequisites: [],
            description: "",
            creditHours: 1,
            minStudents: 1,
            maxStudents: 1
        });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...newCourse,
            category: newCourse.categoryInput.split(",").map(c => c.trim()),
            prerequisites: newCourse.prerequisites ? [newCourse.prerequisites] : []
        };

        const res = await fetch("/api/admin/create-course", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            onClose();
            setNewCourse({
                id: "",
                name: "",
                category: [],
                categoryInput: "",
                prerequisites: [],
                description: "",
                creditHours: 1,
                minStudents: 1,
                maxStudents: 1
            });
            await onCourseCreated();
            toast.success("Course created successfully");


        } else if (res.status === 409) {
            toast.error("Course already exists");
        } else {
            toast.error("Failed to create course");
        }
    };

    return (
        <div className="adm-modal-overlay">
            <div className="adm-modal">
                <div className="adm-modal-header">
                    <h2>Create New Course</h2>
                    <button className="adm-modal-close" onClick={onClose}>✖</button>
                </div>
                <form className="adm-form" onSubmit={handleSubmit}>
                    <div className="adm-form-group">
                        <label>Course ID:</label>
                        <input type="text" name="id" required value={newCourse.id}
                            onChange={(e) => setNewCourse({ ...newCourse, id: e.target.value })}
                        />
                    </div>
                    <div className="adm-form-group">
                        <label>Course Name:</label>
                        <input type="text" name="name" required value={newCourse.name}
                            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                        />
                    </div>
                    <div className="adm-form-group">
                        <label>Prerequisites (Course IDs):</label>
                        <select
                            name="prerequisites"
                            multiple
                            value={newCourse.prerequisites}
                            onChange={(e) =>
                                setNewCourse({
                                    ...newCourse,
                                    prerequisites: Array.from(e.target.selectedOptions, opt => opt.value),
                                })
                            }
                        >
                            {allCourses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.id} – {course.name}
                                </option>
                            ))}
                        </select>
                        {Array.isArray(newCourse.prerequisites) && newCourse.prerequisites.length > 0 && (
                            <div className="adm-chip-container">
                                {newCourse.prerequisites.map((id) => {
                                    const course = allCourses.find((c) => c.id === id);
                                    return (
                                        <span key={id} className="adm-chip">
                                            {course ? `${course.id} – ${course.name}` : id}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <div className="adm-form-group">
                        <label>Category:</label>
                        <input type="text" name="category" placeholder="e.g., Programming, Security" required
                            value={newCourse.categoryInput} onChange={(e) => setNewCourse({ ...newCourse, categoryInput: e.target.value })}
                        />
                    </div>
                    <div className="adm-form-group">
                        <label>Description:</label>
                        <textarea name="description" rows="2" required value={newCourse.description}
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                        />
                    </div>
                    <div className="adm-form-group">
                        <label>Credit Hours:</label>
                        <input type="number" name="creditHours" required value={newCourse.creditHours}
                            onChange={(e) => setNewCourse({ ...newCourse, creditHours: parseInt(e.target.value, 10) })}
                        />
                    </div>
                    <div className="adm-form-group">
                        <label>Min Students:</label>
                        <input type="number" name="minStudents" required value={newCourse.minStudents}
                            onChange={(e) => setNewCourse({ ...newCourse, minStudents: parseInt(e.target.value, 10) })}
                        />
                    </div>
                    <div className="adm-form-group">
                        <label>Max Students:</label>
                        <input type="number" name="maxStudents" required value={newCourse.maxStudents}
                            onChange={(e) => setNewCourse({ ...newCourse, maxStudents: parseInt(e.target.value, 10) })}
                        />
                    </div>
                    <button type="submit" className="adm-btn-validate">Create Course</button>
                </form>
            </div>
        </div>
    );
}