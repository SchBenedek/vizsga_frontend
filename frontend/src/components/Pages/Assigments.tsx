import { useEffect, useState } from "react";
import { Assignment } from "../libs/types";
import { TeacherPageNav } from "../Navbar/TeacherPageNav";
import { useAuth } from "../Login/LoginContext";
import { StudentPageNav } from "../Navbar/StudentPageNav";

export default function assignments(){
    const { role, teacherID } = useAuth();
    const [assignments, setassignments]=useState<Assignment[]>([]);
    const [filterAssignments, setFilterAssignments]=useState<Assignment[]>([]);
    const [loading, setLoading]=useState(true);
    const [error, setError]=useState<string | null>(null);
    const [errorServer, setErrorServer]=useState<string>();

    const fetchAssignments = async () => {
        setLoading(true);
        setError(null);

        try {
            let url = "http://localhost:3000/assignments";
            if (role === "teacher") {
                const teacherResponse = await fetch(`http://localhost:3000/teachers/${teacherID}`);
                if (!teacherResponse.ok) throw new Error("Failed to fetch teacher details");

                const teacherData = await teacherResponse.json();
                url = `http://localhost:3000/assignments?subject=${encodeURIComponent(teacherData.subjectTeacher)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Server responded with status ${response.status}`);

            const data = await response.json();
            setassignments(data);
            setFilterAssignments(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, [teacherID, role]);

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