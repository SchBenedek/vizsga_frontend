import { useState, useEffect } from "react";
import { Assignment } from "../libs/types";
import { sortAssignments } from "../libs/utils";
import Logout from "../Login/Logout";
import { Link } from "react-router-dom";

interface Props {
  assignments: Assignment[];
  setFilterAssignments: (assignments: Assignment[]) => void;
}

export const StudentPageNav = ({
  assignments,
  setFilterAssignments,
}: Props) => {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Assignment;
    direction: "asc" | "desc";
  } | null>(null);
  const [studentName, setStudentName] = useState<string>("Student");

  useEffect(() => {
    const storedName = localStorage.getItem("studentName");
    if (storedName) {
      setStudentName(storedName);
    }
  }, []);

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
    <div
      className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
      style={{
        width: "280px",
        height: "100vh",
        backgroundColor: "#212529",
        borderRight: "5px solid var(--bs-primary)",
      }}
    >
      <div className="d-flex align-items-center mb-4" data-testid="student-name">
        <span className="fs-4 text-white fw-semibold">{studentName}</span>
      </div>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link
            to="/studentmain"
            className={`nav-link ${
              location.pathname === "/studentmain" ? "active" : "text-white"
            }`}
          >
            Főoldal
          </Link>
        </li>
        <li className="nav-item">
          <Link
            to="/rating"
            className={`nav-link ${
              location.pathname === "/rating" ? "active" : "text-white"
            }`}
          >
            Értékelés
          </Link>
        </li>
        <li>
          <Link
            to="/teachers"
            className={`nav-link ${
              location.pathname === "/teachers" ? "active" : "text-white"
            }`}
          >
            Tanárok
          </Link>
        </li>
        <li>
          <Link
            to="/studentAssignedTasks"
            className={`nav-link ${
              location.pathname === "/studentAssignedTasks"
                ? "active"
                : "text-white"
            }`}
          >
            Kiadott feladatok
          </Link>
        </li>
        <li>
          <Link
            to="/markedAssignments"
            className={`nav-link ${
              location.pathname === "/markedAssignments"
                ? "active"
                : "text-white"
            }`}
          >
            Visszaküldött feladatok
          </Link>
        </li>
      </ul>
      <div className="mt-auto">
        <Logout />
      </div>
    </div>
  );
};
