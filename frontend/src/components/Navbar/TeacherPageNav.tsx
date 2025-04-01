import { useState, useEffect } from "react";
import { Assignment } from "../libs/types";
import { sortAssignments } from "../libs/utils";
import Logout from "../Login/Logout";
import { useLocation } from "react-router-dom";

interface Props {
    assignments: Assignment[];
    setFilterAssignments: (assignments: Assignment[]) => void;
}

export const TeacherPageNav = ({ assignments, setFilterAssignments }: Props) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Assignment; direction: "asc" | "desc" }>();
    const [teacherName, setTeacherName] = useState<string>("Teacher");
    const location = useLocation();

    useEffect(() => {
        const storedName = localStorage.getItem("teacherName");
        if (storedName) {
            setTeacherName(storedName);
        }
    }, []);

    const handleSort = (key: keyof Assignment) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        const { sortedAssignments } = sortAssignments(key, direction, [...assignments]);
        setFilterAssignments(sortedAssignments);
        setSortConfig({ key, direction });
    };

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: "280px", height: "100vh" }}>
            <a className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">{teacherName}</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <a href="/teachers/dashboard" className={`nav-link ${location.pathname === "/teachers/dashboard" ? "active" : "text-white"}`}>Főoldal</a>
                </li>
                <li>
                    <a href="/teacher/students" className={`nav-link ${location.pathname === "/teacher/students" ? "active" : "text-white"}`}>Diákok</a>
                </li>
                <li>
                    <a href="/assigments" className={`nav-link ${location.pathname === "/assigments" ? "active" : "text-white"}`}>Feladatok</a>
                </li>
                <li>
                    <a href="/teacherAssignedTasks" className={`nav-link ${location.pathname === "/teacherAssignedTasks" ? "active" : "text-white"}`}>Kiadott feladatok</a>
                </li>
                <li>
                    <a href="/turnedInTasks" className={`nav-link ${location.pathname === "/turnedInTasks" ? "active" : "text-white"}`}>Visszaküldött feladatok</a>
                </li>
            </ul>
            <hr />
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://cdn-desktop-ap-media.osp.opera.software/images/a1832df2-e7e4-11ef-9c82-43c8eac12778/1739215512473/sample_0.jpg" alt="Profile" width="32" height="32" className="rounded-circle me-2" />
                    <strong>Profil</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                    <li><a className="dropdown-item" href="#">Settings</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                        <Logout />
                    </li>
                </ul>
            </div>
        </div>
    );
};
