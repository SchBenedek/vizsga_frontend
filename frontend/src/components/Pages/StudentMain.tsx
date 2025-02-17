import { useEffect, useState } from "react";
import { Assignment, Student } from "../libs/types";
import { StudentPageNav } from "../Navbar/StudentPageNav";
import { useAuth } from "../Login/LoginContext";

export default function StudentMain() {
    const { studentId } = useAuth();
    const [filteredAssignments, setFilterAssignments] = useState<Assignment[]>([]);
    const [student, setStudent] = useState<Student>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorServer, setErrorServer] = useState<string>();

    useEffect(() => {
        if (!studentId) return;

        const studentFetch = async () => {
            try {
                const response = await fetch(`http://localhost:3000/students/${studentId}`);
                if (!response.ok) throw new Error(`Server responded with status ${response.status}`);

                const data = await response.json();
                setStudent(data);
                setFilterAssignments(data.assignments);
                setLoading(false);
            } catch (error) {
                setError(error.message);
            }
        };

        studentFetch();
    }, [studentId]);

    if (!studentId) return <p>Loading student information...</p>;
    if (errorServer) return <p>{errorServer}</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Hiba történt: {error}.</p>;

    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            <StudentPageNav assignments={filteredAssignments} setFilterAssignments={setFilterAssignments} />
            <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
            <h1>Welcome back, {student?.name}!</h1>
            <h3>{student?.email}</h3>
            <div>
                Haló
            </div>
            </main>
            </div>
    );
}
