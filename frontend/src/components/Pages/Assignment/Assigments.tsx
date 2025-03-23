import { useEffect, useState } from "react";
import { Assignment } from "../../libs/types";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";
import { useAuth } from "../../Login/LoginContext";
import { StudentPageNav } from "../../Navbar/StudentPageNav";
import { useNavigate } from "react-router-dom";

export default function Assignments() {
    const { role, teacherSubject } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [filterAssignments, setFilterAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchAssignments = async () => {
        setLoading(true);
        setError(null);

        try {
            let url = "http://localhost:3000/assignments";
            if (role === "Teacher" && teacherSubject) {
                url = `http://localhost:3000/assignments?subject=${encodeURIComponent(teacherSubject)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Server responded with status ${response.status}`);

            const data = await response.json();
            setAssignments(data);
            setFilterAssignments(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [role, teacherSubject]);

    const handleClick = (id: number) => {
        localStorage.setItem("assignmentId", id.toString());
        navigate('/assignmentCard');
    }

    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            {role === "Teacher" ? (
                <TeacherPageNav assignments={filterAssignments} setFilterAssignments={setFilterAssignments} />
            ) : (
                <StudentPageNav assignments={assignments} setFilterAssignments={setFilterAssignments} />
            )}
            <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Hiba történt: {error}.</p>
                ) : (
                    <div className="row">
                        {filterAssignments.map((assignment) => (
                            <div className="col-md-6 col-lg-4 mb-4" key={assignment.id} onClick={() => {handleClick(assignment.id)}}>
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h5 className="card-title font-weight-bold text-primary">
                                            {assignment.subject}
                                        </h5>
                                        <p className="card-text text-muted">
                                            <strong>Korosztály:</strong> {assignment.ageGroup}
                                            <br />
                                            <strong>Leírás:</strong> {assignment.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
