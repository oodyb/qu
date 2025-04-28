"use client";

import { useState, useEffect, useRef } from "react";
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import "../../styles/admin_dashboard.css";

export default function StatisticsModal({ onClose }) {
    const [activeTab, setActiveTab] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const underlineRef = useRef(null);
    const tabsRef = useRef([]);

    const tabs = [
        { label: "Grade Distribution", api: "/api/admin/statistics/grade-distribution" },
        { label: "Enrollment Popularity", api: "/api/admin/statistics/course-popularity" },
        { label: "Category Distribution", api: "/api/admin/statistics/category-distribution" },
        { label: "Class Status Distribution", api: "/api/admin/statistics/status-distribution" },
        { label: "Instructor Load", api: "/api/admin/statistics/instructor-load" },
        { label: "Preferences per Course", api: "/api/admin/statistics/preferences-course" },
        { label: "Capacity vs Enrollment", api: "/api/admin/statistics/capacity-enrollment" },
        { label: "Students per Instructor", api: "/api/admin/statistics/students-instructor" },
        { label: "Courses With/Without Classes", api: "/api/admin/statistics/courses-no-classes" },
        { label: "Class Sizes per Course", api: "/api/admin/statistics/class-size" },
    ];

    useEffect(() => {
        fetchData(tabs[activeTab].api);
    }, [activeTab]);

    async function fetchData(apiUrl) {
        setLoading(true);
        try {
            console.log("Fetching data from:", apiUrl);
            const res = await fetch(apiUrl);

            if (!res.ok) {
                console.error("API returned error status:", res.status);
                throw new Error(`API error: ${res.status}`);
            }

            const data = await res.json();
            console.log("Received data:", data);

            // Check if we got an error object
            if (data.error) {
                console.error("API returned error:", data.error);
                setChartData([]);
                return;
            }

            // Make sure we have an array of objects with name and value properties
            if (Array.isArray(data)) {
                // Ensure all items have name and value properties
                const processed = data.map(item => ({
                    name: item.name || `Item ${Math.random().toString(36).substr(2, 5)}`,
                    value: typeof item.value === 'number' ? item.value : 0,
                    ...item // Keep other properties
                }));
                console.log("Processed chart data:", processed);
                setChartData(processed);
            } else {
                console.error("Expected array but got:", typeof data);
                setChartData([]);
            }
        } catch (err) {
            console.error("Failed to fetch statistics:", err);
            setChartData([]);
        } finally {
            setLoading(false);
        }
    }

    function renderChart() {
        if (loading) return <p>Loading chart...</p>;
        if (!chartData || chartData.length === 0) return <p>No data available.</p>;

        console.log("Rendering chart for tab:", activeTab, "with data:", chartData);

        // Choose chart type based on tab
        if (activeTab === 2 || activeTab === 8) { // Pie Charts
            return (
                <PieChart width={500} height={400}>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        fill="#8884d8"
                        label
                    />
                    <Tooltip />
                </PieChart>
            );
        }

        if (activeTab === 6) { // Capacity vs Enrollment - special handling
            return (
                <BarChart width={600} height={350} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Enrollment" fill="#8884d8" />
                    <Bar dataKey="capacity" name="Capacity" fill="#82ca9d" />
                </BarChart>
            );
        }

        if (activeTab === 1 || activeTab === 5 || activeTab === 9) { // Line Charts
            return (
                <LineChart width={600} height={350} data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                    <Legend />
                </LineChart>
            );
        }

        return (
            <BarChart width={600} height={350} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
        );
    }

    return (
        <div className="adm-s-modal-overlay">
            <div className="adm-s-modal">
                <div className="adm-modal-header">
                    <h2>Statistics</h2>
                    <button className="adm-close-btn" onClick={onClose}>✖</button>
                </div>

                <div className="adm-tabs-tape">
                    {tabs.map((tab, idx) => (
                        <div
                            key={idx}
                            className={`adm-tab-tape ${activeTab === idx ? "active" : ""}`}
                            onClick={() => setActiveTab(idx)}
                            ref={el => tabsRef.current[idx] = el}
                        >
                            {tab.label}
                        </div>
                    ))}
                </div>

                <div className="adm-chart-container">
                    {renderChart()}
                </div>
            </div>
        </div>
    );
}
