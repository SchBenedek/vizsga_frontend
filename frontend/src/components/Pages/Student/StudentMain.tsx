import { useEffect, useState } from "react";
import { Assignment, Student } from "../../libs/types";
import { StudentPageNav } from "../../Navbar/StudentPageNav";
import { useAuth } from "../../Login/LoginContext";

export default function StudentMain() {
    const { studentID } = useAuth();
    const [filteredAssignments, setFilterAssignments] = useState<Assignment[]>([]);
    const [student, setStudent] = useState<Student>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorServer, setErrorServer] = useState<string>();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;
    }, []);

    useEffect(() => {

        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/auth/self`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("authToken")}`
                    }
                });
                if (!response.ok) throw new Error(`Failed to fetch teacher: ${response.status}`);

                const data = await response.json();
                console.log(data)
                setStudent(data);
                setFilterAssignments(data.assigments);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [studentID]);


    if (errorServer) return <p>{errorServer}</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Hiba történt: {error}.</p>;

    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            <StudentPageNav assignments={filteredAssignments} setFilterAssignments={setFilterAssignments} />
            <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
            <h1>Welcome back, {student.user.firstName} {student.user.lastName}!</h1>
            <h3>{student.user.email}</h3>
            <div>
                Haló
            </div>
            </main>
            </div>
    );
}
