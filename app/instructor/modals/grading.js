"use client";

import { useEffect, useState } from "react";
import "../../styles/instructor_dashboard.css";
import toast from "react-hot-toast";

export default function GradingModal({ onClose, instructorId }) {
    const [courses, setCourses] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("");
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState({});

    useEffect(() => {
        async function fetchClasses() {
            try {
                const res = await fetch(`/api/instructor/classes?instructorId=${instructorId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to load classes");

                setCourses(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load classes");
            }
        }

        fetchClasses();
    }, [instructorId]);

    useEffect(() => {
        async function fetchStudents() {
            if (!selectedClassId || !selectedCourseId) return;

            try {
                const res = await fetch(`/api/instructor/students?classId=${selectedClassId}&courseId=${selectedCourseId}`);
                const data = await res.json();

                if (!res.ok) throw new Error(data.error || "Failed to load students");

                setStudents(data);
                const initialGrades = {};
                data.forEach(student => {
                    initialGrades[student.studentId] = "";
                });
                setGrades(initialGrades);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load students");
            }
        }

        fetchStudents();
    }, [selectedClassId, selectedCourseId]);

    const handleGradeChange = (studentId, grade) => {
        setGrades(prev => ({
            ...prev,
            [studentId]: grade,
        }));
    };

    const allGraded = students.length > 0 && students.every(student => grades[student.studentId]);

    async function handleSubmitGrades() {
        try {
            const payload = {
                courseId: selectedCourseId,
                classId: selectedClassId,
                grades,
            };

            const res = await fetch("/api/instructor/grades", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to submit grades");

            toast.success("Grades submitted successfully!");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Error submitting grades: " + err.message);
        }
    }

    return (
        <div className="ins-modal-overlay">
            <div className="ins-modal">
                <div className="ins-modal-header">
                    <h2>Instructor Grading</h2>
                    <button className="ins-close-btn" onClick={onClose}>✖</button>
                </div>

                <div className="ins-grading-section">
                    <div className="ins-grading-selects">
                        <select
                            value={selectedCourseId}
                            onChange={(e) => setSelectedCourseId(e.target.value)}
                            className="ins-class-dropdown"
                        >
                            <option value="">Select Course</option>
                            {courses.map(course => (
                                <option key={course.courseId} value={course.courseId}>
                                    {course.courseId} - {course.courseName}
                                </option>
                            ))}
                        </select>

                        {selectedCourseId && (
                            <select
                                value={selectedClassId}
                                onChange={(e) => setSelectedClassId(e.target.value)}
                                className="ins-class-dropdown"
                            >
                                <option value="">Select Class</option>
                                {courses
                                    .find(course => course.courseId === selectedCourseId)
                                    ?.classes.map(cls => (
                                        <option key={cls.classId} value={cls.classId}>
                                            {cls.classId}
                                        </option>
                                    ))}
                            </select>
                        )}
                    </div>

                    {students.length > 0 && (
                        <table className="ins-table">
                            <thead>
                                <tr>
                                    <th>Student ID</th>
                                    <th>Name</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(student => (
                                    <tr key={student.studentId}>
                                        <td>{student.studentId}</td>
                                        <td>{student.name}</td>
                                        <td>
                                            <select
                                                value={grades[student.studentId]}
                                                onChange={(e) => handleGradeChange(student.studentId, e.target.value)}
                                                className="ins-class-dropdown"
                                            >
                                                <option value="">Select Grade</option>
                                                <option value="A">A</option>
                                                <option value="B+">B+</option>
                                                <option value="B">B</option>
                                                <option value="C+">C+</option>
                                                <option value="C">C</option>
                                                <option value="D+">D+</option>
                                                <option value="D">D</option>
                                                <option value="F">F</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div className="ins-submit-container">
                        <button
                            className="ins-btn-submit"
                            onClick={handleSubmitGrades}
                            disabled={!allGraded}
                        >
                            Submit Grades
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}