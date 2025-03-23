import { useEffect, useState } from "react";
import { useAuth } from "../../Login/LoginContext";
import { Student } from "../../libs/types";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";

export default function TeacherStudents() {
    const { role } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (role !== "Teacher") return;

        fetch(`http://localhost:3000/users/students`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Server responded with status ${response.status}`);
                }
                return response.json();
            })
            .then((data: Student[]) => {
                console.log("Fetched students:", data);
                setStudents(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [role, token]);

    if (role !== "Teacher") return <p>Unauthorized: Only teachers can view this page.</p>;
    if (loading) return <p>Loading students...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            <TeacherPageNav assignments={[]} setFilterAssignments={()=>[]} />
            <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
            {students.length === 0 ? (
                <p>You currently have no students assigned.</p>
            ) : (
                <div className="row">
                    {students.map((student) => (
                        <div className="col-md-6 col-lg-4 mb-4" key={student.id}>
                            <div className="card shadow-sm h-100">
                                <div className="card-body">
                                    <h5 className="card-title font-weight-bold text-primary">
                                        {student.firstName} {student.lastName}
                                    </h5>
                                    <p className="card-text text-muted">
                                        <strong>Email:</strong> {student.email}
                                        <br />
                                        <strong>Age Group:</strong> {student.student.ageGroup}
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
