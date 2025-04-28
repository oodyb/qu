"use client";
import { useState } from "react";
import "../../styles/student_dashboard.css";

export default function LearningPathModal({ onClose, enrolledCourses, completedCourses }) {
    const [modalSearchName, setModalSearchName] = useState("");
    const [modalSearchCategory, setModalSearchCategory] = useState("");

    const combinedCourses = [
        ...enrolledCourses.map(course => ({
            ...course,
            status: "In_Progress",
            category: "Enrolled",
            grade: "N/A"
        })),
        ...completedCourses.map(course => ({
            ...course,
            status: "Completed",
            category: "Completed",
            grade: course.grade || "N/A"
        }))
    ];

    const filteredCourses = combinedCourses.filter(course => {
        const matchesName = course.name.toLowerCase().includes(modalSearchName.toLowerCase());
        const matchesCategory = modalSearchCategory === "" || course.category === modalSearchCategory;
        return matchesName && matchesCategory;
    });

    return (
        <div className="stu-modal-overlay">
            <div className="stu-modal">
                <div className="stu-modal-header">
                    <h2 className="stu-modal-title">Learning Path</h2>
                    <button onClick={onClose} className="stu-close-btn">✖</button>
                </div>
                <div className="stu-search-bar">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={modalSearchName}
                        onChange={(e) => setModalSearchName(e.target.value)}
                    />
                    <select
                        value={modalSearchCategory}
                        onChange={(e) => setModalSearchCategory(e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="stu-table-wrapper">
                    <table className="stu-table">
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Class ID</th>
                                <th>Category</th>
                                <th>Instructor</th>
                                <th>Status</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.length === 0 ? (
                                <tr><td colSpan="6">No courses found.</td></tr>
                            ) : (
                                filteredCourses.map((course, index) => (
                                    <tr key={course.classId || index}>
                                        <td>{course.name}</td>
                                        <td>{course.classId}</td>
                                        <td>{course.category}</td>
                                        <td>{course.instructor}</td>
                                        <td>{course.status}</td>
                                        <td>{course.grade}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}