import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Assignment, Student, Teacher } from "../../libs/types";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";
import { useAuth } from "../../Login/LoginContext";
import { StudentPageNav } from "../../Navbar/StudentPageNav";
import { Button } from "react-bootstrap";

export default function TeacherMain() {
    const { teacherID: authTeacherID } = useAuth();
    const { teacherID: routeTeacherID } = useParams<{ teacherID: string }>();

    const { studentID } = useAuth();

    const teacherID = routeTeacherID || authTeacherID;

    const [student, setStudent] = useState<Student | null>(null);
    const [filteredAssignments, setFilterAssignments] = useState<Assignment[]>([]);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        /*fetch(`http://localhost:3000/students/${studentID}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
            if (!response.ok) throw new Error(`Failed to fetch student: ${response.status}`);
            return response.json();
        })
        .then((data: Student) => {
            setStudent(data);
        })
        .catch((error) => console.error("Error fetching student:", error));*/
    }, []);

    useEffect(() => {

        const fetchTeacher = async () => {
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
                setTeacher(data);
                const filtered = data.assignments?.filter((assignment: Assignment) => assignment.subject === data.subjectTeacher) || [];
                setFilterAssignments(filtered);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, [teacherID]);

    /*const addTeacherId = (teacherId: number) => {
        if (!student) {
            console.error("Student not found.");
            return;
        }

        const token = localStorage.getItem("authToken");

        fetch(`http://localhost:3000/students/${student.id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ teacherId }),
        })
        .then((response) => {
            if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
            return response.json();
        })
        .then((data: Student) => {
            setStudent(data);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        })
        .catch((error) => console.error("Error updating student:", error));
    };*/

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!teacher) return <p>No teacher found.</p>;

    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            {showSuccess && (
                <div style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "white",
                    padding: "20px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
                    borderRadius: "10px",
                    zIndex: 1000,
                    textAlign: "center",
                }}>
                    <h3>✅ Successfully Added!</h3>
                </div>
            )}

            {routeTeacherID ? (
                <StudentPageNav assignments={filteredAssignments} setFilterAssignments={setFilterAssignments} />
            ) : (
                <TeacherPageNav assignments={filteredAssignments} setFilterAssignments={setFilterAssignments} />
            )}

            <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
                <h1>{routeTeacherID ? `${teacher.name}` : `Welcome back, ${teacher.name}!`}</h1>
                <h3>{teacher.email}</h3>
                {routeTeacherID ? <h3>{teacher.subjectTeacher}</h3> : <hr />}

                <div>
                    <h4>{routeTeacherID ? "Rating:" : "Your Rating:"}</h4>
                    {Array.from({ length: teacher.rating }, (_, index) => (
                        <span key={index} style={{ color: "gold", fontSize: "1.5rem" }}>⭐</span>
                    ))}
                </div>

                {/*routeTeacherID && (
                    <Button onClick={() => addTeacherId(teacher.id)}>Tanulok</Button>
                )*/}
            </main>
        </div>
    );
}
