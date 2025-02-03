import { useState } from "react";
import { Assignment } from "../libs/types";
import { sortAssignments } from "../libs/utils";

interface Props {
    assignments: Assignment[];
    setFilterAssignments: (assignments: Assignment[]) => void;
}

export const TeacherPageNav = ({assignments, setFilterAssignments}: Props) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Assignment; direction: "asc" | "desc" } | null>(null);

    const handleSort = (key: keyof Assignment) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
          direction = "desc";
        }
        const { sortedAssignments } = sortAssignments(key, direction, assignments);
        setFilterAssignments(sortedAssignments);
        setSortConfig({ key, direction });
      };    

    return (
        <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: "280px", height: "100vh" }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span className="fs-4">Sidebar</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <a href="#" className="nav-link active">
                        Főoldal
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link text-white">
                        Diákok
                    </a>
                </li>
                <li>
                    <a href="/assigments" className="nav-link text-white">
                        Feladatok
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link text-white">
                        Kiadott feladatok
                    </a>
                </li>
                <li>
                    <a href="#" className="nav-link text-white">
                        Visszaküldött feladatok
                    </a>
                </li>
                <li className="nav-item dropdown">
                    <a
                        className="nav-link dropdown-toggle text-primary"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        Rendezés
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li>
                        <a
                            className="dropdown-item"
                            href="#"
                            onClick={() => handleSort("ageGroup")}
                        >
                            Korosztály
                        </a>
                        </li>
                    </ul>
                </li>
            </ul>
            <hr />
            <div className="dropdown">
                <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="https://github.com/mdo.png" alt="Profile" width="32" height="32" className="rounded-circle me-2" />
                    <strong>mdo</strong>
                </a>
                <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                    <li><a className="dropdown-item" href="#">New project...</a></li>
                    <li><a className="dropdown-item" href="#">Settings</a></li>
                    <li><a className="dropdown-item" href="#">Profile</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item" href="#">Sign out</a></li>
                </ul>
            </div>
        </div>
    );
}
