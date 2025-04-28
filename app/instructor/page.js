"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import "../styles/instructor_dashboard.css";
import GradingModal from "./modals/grading";

export default function InstructorDashboard() {
    const [courses, setCourses] = useState([]);
    const [selectedClasses, setSelectedClasses] = useState({});
    const [currentInstructorId, setCurrentInstructorId] = useState(null);
    const [submittedPreferences, setSubmittedPreferences] = useState({});
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    async function fetchPreferences(instructorId) {
        try {
            const res = await fetch(`/api/instructor/preferences?instructorId=${instructorId}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to load preferences");
            }

            const mapped = {};
            data.forEach(pref => {
                mapped[pref.courseId] = pref.classId;
            });

            setSubmittedPreferences(mapped);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load submitted preferences");
        }
    }

    async function fetchClasses() {
        try {
            const res = await fetch("/api/student/classes");
            const data = await res.json();

            const groupedCourses = {};
            const initialSelections = {};

            data.forEach(cls => {
                if (cls.instructorName !== "Unassigned") {
                    return;
                }

                if (!groupedCourses[cls.courseId]) {
                    groupedCourses[cls.courseId] = { courseId: cls.courseId, courseName: cls.courseName, category: cls.category, classes: [] };
                }

                groupedCourses[cls.courseId].classes.push({
                    classId: cls.classId,
                    instructorName: cls.instructorName || "Unassigned",
                    schedule: cls.schedule || {},
                    currentStudents: cls.currentStudents || 0,
                    capacity: cls.capacity,
                    room: cls.schedule?.room || "N/A",
                });
            });

            const finalCourses = Object.values(groupedCourses).filter(course => course.classes.length > 0);
            finalCourses.forEach(course => {
                initialSelections[course.courseId] = course.classes[0].classId;
            });

            setCourses(finalCourses);
            setSelectedClasses(initialSelections);
        } catch (err) {
            toast.error("Failed to load courses");
        }
    }

    function handleClassChange(courseId, classId) {
        setSelectedClasses(prev => ({ ...prev, [courseId]: classId, }));
    }

    async function handleSubmit(courseId) {
        const selectedClassId = selectedClasses[courseId];
        if (!selectedClassId) {
            toast.error("Please select a class first.");
            return;
        }

        try {
            const res = await fetch("/api/instructor/preferences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    instructorId: currentInstructorId,
                    courseId,
                    classId: selectedClassId,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to submit preference");
            }

            toast.success("Preference submitted successfully!");
            fetchClasses();
            setSubmittedPreferences(prev => ({
                ...prev,
                [courseId]: selectedClassId
            }));
        } catch (err) {
            toast.error("Error submitting preference: " + err.message);
        }
    }

    function getSelectedClass(course) {
        return course.classes.find(cls => cls.classId === selectedClasses[course.courseId]);
    }

    useEffect(() => {
        if (status === "loading") return;
        if (!session || session.user.role !== "INSTRUCTOR") {
            toast.error("Access denied. Please log in");
            router.push("/login");
        }
        if (status === "authenticated" && session?.user?.role === "INSTRUCTOR") {
            fetchClasses();
            fetchPreferences(session.user.id);
            setCurrentInstructorId(session.user.id);
        }
    }, [session, status, router]);

    return (
        <div className="ins-container">
            <header className="ins-header">
                <div className="ins-header-content">
                    <div className="ins-logo-container">
                        <div className="ins-logo-img">
                            <img src="/images/qu-logo.png" alt="Qatar University logo" width="100%" />
                        </div>
                        <h1 className="ins-title">
                            QU <span className="ins-subtitle">Instructor</span>
                        </h1>
                    </div>
                    <nav className="ins-nav">
                        {session && (
                            <li className="ins-username-badge">
                                Welcome, {session.user.name || session.user.username}
                            </li>
                        )}
                        <ul className="ins-nav-links">
                            <li><a
                                className="ins-nav-link"
                                onClick={() => setIsGradingModalOpen(true)}
                            >Grading</a>
                            </li>
                            <li>
                                <a className="ins-logout" onClick={async () => {
                                    await signOut({ callbackUrl: "/login" });
                                }}>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
            <main className="ins-main">
                <section className="ins-courses-section">
                    <div className="ins-bar">
                        <h2>Course Preferences</h2>
                    </div>
                    <div className="ins-courses-container">
                        <table className="ins-table">
                            <thead>
                                <tr>
                                    <th>Course ID</th>
                                    <th>Course Name</th>
                                    <th>Category</th>
                                    <th>Select Class</th>
                                    <th>Day(s)</th>
                                    <th>Time</th>
                                    <th>Room</th>
                                    <th>Submit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.length === 0 ? (
                                    <tr><td colSpan="8">No courses found.</td></tr>
                                ) : (
                                    courses.map(course => {
                                        const selectedClass = getSelectedClass(course);
                                        return (
                                            <tr key={course.courseId}>
                                                <td>{course.courseId}</td>
                                                <td>{course.courseName}</td>
                                                <td>{Array.isArray(course.category) ? course.category.join(", ") : course.category}</td>
                                                <td>
                                                    {submittedPreferences[course.courseId] ? (
                                                        <div className="registered-label">
                                                            {submittedPreferences[course.courseId]}
                                                        </div>
                                                    ) : (
                                                        <select
                                                            value={selectedClasses[course.courseId] || ""}
                                                            onChange={(e) => handleClassChange(course.courseId, e.target.value)}
                                                            className="ins-class-dropdown"
                                                        >
                                                            {course.classes.map(cls => (
                                                                <option key={cls.classId} value={cls.classId}>
                                                                    {cls.classId}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                </td>
                                                <td>
                                                    {selectedClass?.schedule?.day?.join(", ") || "N/A"}
                                                </td>
                                                <td>
                                                    {selectedClass?.schedule?.time || "N/A"}
                                                </td>
                                                <td>
                                                    {selectedClass?.room || "N/A"}
                                                </td>
                                                <td>
                                                    {submittedPreferences[course.courseId] ? (
                                                        <span className="registered-label">Submitted</span>
                                                    ) : (
                                                        <button
                                                            className="ins-btn-submit"
                                                            onClick={() => handleSubmit(course.courseId)}
                                                        >
                                                            Submit
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
            {isGradingModalOpen && (
                <GradingModal
                    instructorId={currentInstructorId}
                    onClose={() => setIsGradingModalOpen(false)}
                />
            )}
            <footer className="ins-footer">
                <p>&copy; 2025 CSE Department - Qatar University</p>
            </footer>
        </div>
    );
}