import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Assignment, Student, Teacher } from "../../libs/types";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";
import { useAuth } from "../../Login/LoginContext";
import { StudentPageNav } from "../../Navbar/StudentPageNav";
import { Button } from "react-bootstrap";
import { useFetch } from "../../libs/api";

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
        fetchTeacher();
      }, [teacherID]);
    
      const fetchTeacher = async () => {
        try {
          setLoading(true);
    
          const response = await useFetch<Teacher | null>(
            `http://localhost:3000/auth/self`,
            "GET"
          );
    
          if (!response || response.statuszKod !== 200) {
            throw new Error(`Failed to fetch teacher: ${response?.statuszKod}`);
          }
    
          const data = response.adat;
    
          if (!data) {
            throw new Error("No student data received.");
          }
    
          console.log(data);
          setTeacher(data);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!teacher) return <p>No teacher found.</p>;
    if (teacher)

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
                <h1>{routeTeacherID ? `${teacher.firstName} ${teacher.lastName}` : `Welcome back, ${teacher.firstName} ${teacher.lastName}!`}</h1>
                <h3>{teacher.email}</h3>
                {routeTeacherID ? <h3>{teacher.subject}</h3> : <hr />}

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
