"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import CreateClassModal from "./modals/createClassModal";
import CreateCourseModal from "./modals/createCourseModal";
import ApprovePreferencesModal from "./modals/instructorsModal"
import CourseScheduleModal from "./modals/courseScheduleModal";
import StatisticsModal from "./modals/statisticsModal";
import "../styles/admin_dashboard.css";

export default function AdminDashboard() {
    const [allCourses, setAllCourses] = useState([]);
    const [classes, setClasses] = useState([]);
    const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
    const [showCreateClassModal, setShowCreateClassModal] = useState(false);
    const [instructors, setInstructors] = useState([]);
    const [showInstructorApprovalModal, setShowInstructorApprovalModal] = useState(false);
    const [showCourseScheduleModal, setShowCourseScheduleModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [showStatsModal, setShowStatsModal] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();

    async function fetchClasses() {
        try {
            const res = await fetch("/api/admin/get-classes");
            const data = await res.json();
            setClasses(data);
        } catch (err) { toast.error("Failed to load classes"); }
    } useEffect(() => { fetchClasses(); }, []);


    async function fetchCourses() {
        try {
            const res = await fetch("/api/admin/get-courses");
            const data = await res.json();
            setAllCourses(data);
        } catch (err) { toast.error("Failed to load courses"); }
    } useEffect(() => { fetchCourses(); }, []);


    async function fetchInstructors() {
        try {
            const res = await fetch("/api/admin/get-instructors");
            const data = await res.json();
            setInstructors(data);
        } catch (err) { toast.error("Failed to load instructors"); }
    } useEffect(() => { fetchInstructors(); }, []);

    async function validateClass(id, courseId) {
        try {
            const res = await fetch("/api/admin/validate-class", {
                method: "POST",
                body: JSON.stringify({ id, courseId }),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) { throw new Error("Server responded with error"); }

            setClasses(prev => prev.map(cls => cls.classId === id ? { ...cls, status: "IN_PROGRESS" } : cls));
            toast.success("Class validated successfully");
        } catch (err) { toast.error("Validation failed"); }
    };

    async function cancelClass(id, courseId) {
        try {
            const res = await fetch("/api/admin/cancel-class", {
                method: "POST",
                body: JSON.stringify({ id, courseId }),
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) { throw new Error("Server responded with error"); }

            setClasses(prev => prev.filter(cls => cls.classId !== id));
            toast.success("Class cancelled successfully");
        } catch (err) { toast.error("Cancellation failed"); }
    };

    useEffect(() => {
        if (status === "loading") return;
        if (!session || session.user.role !== "ADMIN") {
            toast.error("Access denied. Please log in");
            router.push("/login");
        }
    }, [session, status, router]);

    if (status === "loading") {
        return <div className="loading-container">Loading...</div>;
    }

    if (!session || session.user.role !== "ADMIN") {
        return null;
    }

    return (
        <>
            <div className="adm-container">
                <header className="adm-header">
                    <div className="adm-header-content">
                        <div className="adm-logo-container">
                            <div className="adm-logo-img">
                                <img src="/images/qu-logo.png" alt="Qatar University logo" width="100%" />
                            </div>
                            <h1 className="adm-title">
                                QU <span className="adm-subtitle">Admin</span>
                            </h1>
                        </div>
                        <nav className="adm-nav" id="admin-navbar">
                            {session && (
                                <li className="adm-username-badge">
                                    Welcome, {session.user.name || session.user.username}
                                </li>
                            )}
                            <ul className="adm-nav-links" id="admin-nav-links">
                                <li>
                                    <a
                                        href="#"
                                        className="adm-nav-link"
                                        onClick={() => setShowCourseScheduleModal(true)}
                                    >
                                        View Schedule
                                    </a>
                                </li>
                                <li>
                                    <a href="#" id="showCourseBtn" className="adm-nav-link" onClick={() => setShowCreateCourseModal(true)}>
                                        Create Course
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        id="showClassBtn"
                                        className="adm-nav-link"
                                        onClick={() => setShowCreateClassModal(true)}
                                    >
                                        Create Class
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="adm-nav-link"
                                        onClick={() => setShowInstructorApprovalModal(true)}
                                    >
                                        Instructor Prefrences
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="adm-nav-link"
                                        onClick={() => setShowStatsModal(true)}                                    >
                                        Statistics
                                    </a>
                                </li>
                                <li> <a className="adm-logout" onClick={async () => { await signOut({ callbackUrl: "/login" }); }}>Logout</a></li>
                            </ul>
                        </nav>
                    </div>
                </header>
                <main className="adm-main">
                    <section className="adm-validation-section">
                        <div className="adm-courses-container" id="admin-dash">
                            <div className="adm-bar">
                                <h2>Approve Classes</h2>
                                <div className="adm-filter-bar">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="adm-select-filter"
                                    >
                                        <option value="">All Statuses</option>
                                        <option value="OPEN">Open</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETED">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <table id="coursesTable" className="adm-table">
                                <thead>
                                    <tr>
                                        <th>Course Name</th>
                                        <th>Class</th>
                                        <th>Category</th>
                                        <th>Instructor</th>
                                        <th>Enrollments</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {classes
                                        .filter(cls =>
                                            statusFilter === "" || cls.status === statusFilter
                                        )
                                        .map((cls, i) => (
                                            <tr key={i}>
                                                <td>{cls.courseName}</td>
                                                <td>{cls.classId}</td>
                                                <td>{Array.isArray(cls.category) ? cls.category.join(", ") : cls.category}</td>
                                                <td>{cls.instructorName}</td>
                                                <td>{(cls.currentStudents || 0)}</td>
                                                <td>{cls.status}</td>
                                                <td>
                                                    {cls.status === "OPEN" ? (
                                                        <div>
                                                            <button className="adm-btn-validate" onClick={() => validateClass(cls.classId, cls.courseId)}>
                                                                Validate
                                                            </button>
                                                            <button className="adm-btn-cancel" onClick={() => cancelClass(cls.classId, cls.courseId)}>
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            {showCreateCourseModal && (
                                <CreateCourseModal
                                    onClose={() => setShowCreateCourseModal(false)}
                                    allCourses={allCourses}
                                    onCourseCreated={fetchCourses}
                                />
                            )}
                            {showCreateClassModal && (
                                <CreateClassModal
                                    onClose={() => setShowCreateClassModal(false)}
                                    allCourses={allCourses}
                                    instructors={instructors}
                                    onClassCreated={fetchClasses}
                                />
                            )}
                            {showInstructorApprovalModal && (
                                <ApprovePreferencesModal onClose={() => setShowInstructorApprovalModal(false)} />
                            )}
                            {showCourseScheduleModal && (
                                <CourseScheduleModal onClose={() => setShowCourseScheduleModal(false)} />
                            )}
                            {showStatsModal && (
                                <StatisticsModal onClose={() => setShowStatsModal(false)} />
                            )}
                        </div>
                    </section>
                </main>
                <footer className="adm-footer">
                    <p>&copy; 2025 CSE Department - Qatar University</p>
                </footer>
            </div>
        </>
    );
}