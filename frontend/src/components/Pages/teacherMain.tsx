import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Assignment, Teacher } from "../libs/types";
import { TeacherPageNav } from "../Navbar/TeacherPageNav";
import { useAuth } from "../Login/LoginContext";
import { StudentPageNav } from "../Navbar/StudentPageNav";

export default function TeacherMain() {
    const { teacherID: authTeacherID } = useAuth();
    const { teacherID: routeTeacherID } = useParams<{ teacherID: string }>();

    const teacherID = routeTeacherID || authTeacherID;
    const [filteredAssignments, setFilterAssignments] = useState<Assignment[]>([]);
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!teacher) return <p>No teacher found.</p>;

    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            {routeTeacherID ? (
                <StudentPageNav assignments={filteredAssignments} setFilterAssignments={setFilterAssignments} />
            ) : (
                <TeacherPageNav assignments={filteredAssignments} setFilterAssignments={setFilterAssignments} />
            )}
            <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
                <h1>{routeTeacherID ? `${teacher.name}` : `Welcome back, ${teacher.name}!`}</h1>
                <h3>{teacher.email}</h3>
                {teacherID ? (
                    <h3>{teacher.subjectTeacher}</h3>
                ) : (
                    <hr></hr>
                )
            }
                <div>
                    <h4>{teacherID ? "Rating:" : "Your Rating:"}</h4>
                    {teacher.rating ? (
                        Array.from({ length: teacher.rating }, (_, index) => (
                            <span key={index} style={{ color: "gold", fontSize: "1.5rem" }}>⭐</span>
                        ))
                    ) : (
                        <p>No ratings yet.</p>
                    )}
                </div>
            </main>
        </div>
    );
}
