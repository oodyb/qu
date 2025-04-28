"use client";
import React, { useEffect, useState } from "react";
import "../../styles/admin_dashboard.css";

export default function CourseScheduleModal({ onClose }) {
  const [classes, setClasses] = useState([]);
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const timeSlots = [
    "08:00 - 08:50",
    "09:00 - 09:50",
    "10:00 - 10:50",
    "11:00 - 11:50",
    "12:00 - 12:50",
    "13:00 - 13:50",
    "14:00 - 14:50",
    "15:00 - 15:50",
    "16:00 - 16:50",
    "17:00 - 17:50",
  ];

  async function fetchSchedule() {
    const res = await fetch("/api/admin/get-schedule");
    const data = await res.json();
    setClasses(data);
  } useEffect(() => { fetchSchedule(); }, []);

  function generateScheduleMap() {
    const map = {};
    for (let time of timeSlots) {
      map[time] = {};
      for (let day of weekDays) {
        map[time][day] = [];
      }
    }

    for (let cls of classes) {
      const schedule = cls.schedule || {};
      if (schedule.time && Array.isArray(schedule.day)) {
        schedule.day.forEach(day => {
          if (map[schedule.time]?.[day] !== undefined) {
            map[schedule.time][day].push(
              <div className="class-block" key={`${cls.id}-${day}`} style={{ padding: "0.5em" }}>
                <strong>{cls.courseId}</strong> ({cls.id}) <br />
                Room {schedule.room || "N/A"}
              </div>
            );
          }
        });
      }
    }
    return map;
  }

  const scheduleMap = classes.length > 0 ? generateScheduleMap() : {};

  return (
    <div className="adm-modal-overlay">
      <div className="adm-modal" style={{ width: "90%", maxWidth: "1200px", maxHeight: "90vh", overflowY: "auto" }}>
        <div className="adm-modal-header">
          <h2>Weekly Schedule</h2>
          <button className="adm-modal-close" onClick={onClose}>✖</button>
        </div>

        <div className="adm-modal-body">
          <table className="adm-table schedule-table">
            <thead>
              <tr>
                <th>Time</th>
                {weekDays.map(day => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map(time => (
                <tr key={time}>
                  <td>{time}</td>
                  {weekDays.map(day => (
                    <td key={day}>
                      {scheduleMap[time] && scheduleMap[time][day]?.length > 0
                        ? scheduleMap[time][day]
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}