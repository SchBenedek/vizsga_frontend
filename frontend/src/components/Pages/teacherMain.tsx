import { useEffect, useState } from "react";
import { Assignment, Teacher } from "../libs/types";
import { TeacherPageNav } from "./teacherPageNav";
import { useAuth } from "../Login/LoginContext";

export default function TeacherMain() {
    const { teacherId } = useAuth();
    const [filteredAssignments, setFilterAssignments] = useState<Assignment[]>([]);
    const [teacher, setTeacher] = useState<Teacher>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [errorServer, setErrorServer] = useState<string>();

    useEffect(() => {
        if (!teacherId) return;

        const teacherFetch = async () => {
            try {
                const response = await fetch(`http://localhost:3000/teachers/${teacherId}`);
                if (!response.ok) throw new Error(`Server responded with status ${response.status}`);

                const data = await response.json();
                setTeacher(data);
                setFilterAssignments(data.assignments);
                setLoading(false);
            } catch (error) {
                setError(error.message);
            }
        };

        teacherFetch();
    }, [teacherId]);

    if (!teacherId) return <p>Loading teacher information...</p>;
    if (errorServer) return <p>{errorServer}</p>;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Hiba történt: {error}.</p>;

    return (
        <div className="d-flex" style={{ height: "100vh" }}>
            <TeacherPageNav assignments={filteredAssignments} setFilterAssignments={setFilterAssignments} />
            <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
            <h1>Welcome back, {teacher?.name}!</h1>
            <h3>{teacher?.email}</h3>
            <div>
                <h4>A Te értékelés:</h4>
                {teacher?.rating && (
                    <div>
                        {Array.from({ length: teacher.rating }, (_, index) => (
                            <span key={index} style={{ color: "gold", fontSize: "1.5rem" }}>⭐</span>
                        ))}
                    </div>
                )}
            </div>
            </main>
            </div>
    );
}
