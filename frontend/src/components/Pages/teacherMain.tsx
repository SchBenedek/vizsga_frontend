import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Assignment, Teacher } from "../libs/types";
import { TeacherPageNav } from "../Navbar/TeacherPageNav";
import { useAuth } from "../Login/LoginContext";
import { StudentPageNav } from "../Navbar/StudentPageNav";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function TeacherMain() {
    const { teacherID: authTeacherID } = useAuth();
    const { teacherID: routeTeacherID } = useParams<{ teacherID: string }>();

    const teacherID = routeTeacherID || authTeacherID;
    const [filteredAssignments, setFilterAssignments] = useState<Assignment[]>([]);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (!teacherID) return;

        const fetchTeacher = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3000/teachers/${teacherID}`);
                if (!response.ok) throw new Error(`Failed to fetch teacher: ${response.status}`);

                const data = await response.json();
                setTeacher(data);
                setFilterAssignments(data.assignments || []);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacher();
    }, [teacherID]);

    const addToTeacher = async () => {
        if (!teacherID) return;
    
        try {
            setShowSuccess(false);

            const response = await fetch(`http://localhost:3000/teachers/${teacherID}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    numberOfStudents: (teacher?.numberOfStudents || 0) + 1,
                }),
            });
    
            if (!response.ok) throw new Error(`Failed to update teacher: ${response.status}`);
    
            const updatedTeacher = await response.json();
            setTeacher(updatedTeacher);
            setShowSuccess(true);
            setTimeout(() => {
                navigate("/teachers");
            }, 2000);
        } catch (error: any) {
            setError(error.message);
        }
    };
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!teacher) return <p>No teacher found.</p>;

    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            {showSuccess? (
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
            ):(null)}
            {routeTeacherID ? (
                <StudentPageNav assignments={filteredAssignments} setFilterAssignments={setFilterAssignments} />
            ) : (
                <TeacherPageNav assignments={filteredAssignments} setFilterAssignments={setFilterAssignments} />
            )}
            <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
                <h1>{routeTeacherID ? `${teacher.name}` : `Welcome back, ${teacher.name}!`}</h1>
                <h3>{teacher.email}</h3>
                {routeTeacherID ? ( <h3>{teacher.subjectTeacher}</h3> ) : ( <hr></hr> )}
                <div>
                    <h4>{routeTeacherID ? "Rating:" : "Your Rating:"}</h4>
                    {Array.from({ length: teacher.rating }, (_, index) => (
                        <span key={index} style={{ color: "gold", fontSize: "1.5rem" }}>⭐</span>
                    ))}
                </div>
                {routeTeacherID ? (
                    <Button onClick={addToTeacher}>Tanulok</Button>
                ) : (
                    null
                )}
            </main>
        </div>
    );
}
