import { useEffect, useState } from "react";
import { Assignment } from "../libs/types";
import { TeacherPageNav } from "../Navbar/TeacherPageNav";
import { useAuth } from "../Login/LoginContext";
import { StudentPageNav } from "../Navbar/StudentPageNav";

export default function assignments(){
    const { role } = useAuth;
    const [assignments, setassignments]=useState<Assignment[]>([]);
    const [filterAssignments, setFilterAssignments]=useState<Assignment[]>([]);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState<string | null>(null);
    const [errorServer, setErrorServer]=useState<string>();

    const fetchAssignments = () =>{
        setLoading(true);
        setError(null);

        fetch(`http://localhost:3000/assignments`)
            .then((response) => {
                if (response.status === 404) {
                    setErrorServer("A kért erőforrás nem található (404)!");
                }
                if (!response.ok) {
                    setErrorServer(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setassignments(data);
                setFilterAssignments(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    if (errorServer) {
        return <p>{errorServer}</p>;
    }
    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Hiba történt: {error}.</p>;
    }

    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            {role === "teacher" ? (
                <TeacherPageNav assignments={assignments} setFilterAssignments={setFilterAssignments} />
            ) : (
                <StudentPageNav assignments={assignments} setFilterAssignments={setFilterAssignments} />
            )}
            <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
                <div className="row">
                    {assignments.map((assignment) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={assignment.id}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title font-weight-bold text-primary">
                                        {assignment.subject}
                                    </h5>
                                    <p className="card-text text-muted">
                                        <strong>Korosztály:</strong> {assignment.ageGroup}
                                        <br />
                                        <strong>Leírás:</strong> {assignment.assignments}
                                        <br />
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );    
}