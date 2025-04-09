import { useEffect, useState } from "react";
import { Assignment, Student } from "../../libs/types";
import { StudentPageNav } from "../../Navbar/StudentPageNav";
import { useAuth } from "../../Login/LoginContext";
import { useFetch } from "../../libs/api";

export default function StudentMain() {
  const { studentID } = useAuth();
  const [filteredAssignments, setFilterAssignments] = useState<Assignment[]>(
    []
  );
  const [student, setStudent] = useState<Student>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorServer, setErrorServer] = useState<string>();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    fetchStudents();
  }, [studentID]);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await useFetch<Student | null>(
        `http://localhost:3000/auth/self`,
        "GET"
      );

      if (!response || response.statuszKod !== 200) {
        throw new Error(`Failed to fetch student: ${response?.statuszKod}`);
      }

      const data = response.adat;

      if (!data) {
        throw new Error("No student data received.");
      }

      setStudent(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (errorServer) return <p>{errorServer}</p>;
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Hiba történt: {error}.</p>;
  if (!student) return <p>Student nem található</p>;
  if (student)
    return (
      <div
        className="d-flex"
        style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
      >
        <StudentPageNav
          assignments={filteredAssignments}
          setFilterAssignments={setFilterAssignments}
        />

        <main
          className="container-fluid p-4 overflow-auto"
          style={{
            flexGrow: 1,
            backgroundColor: "#fff",
            color: "#212529",
          }}
        >
          <div
            className="p-4 rounded shadow alert alert-info"
          >
            <h1 className="text-primary mb-3">
              Üdvözlünk, {student.firstName} {student.lastName}!
            </h1>
            <h4 className="text-dark">{student.email}</h4>
            {student.ageGroup !== "University" && (
              <h5 className="text-secondary">{student.ageGroup}-school</h5>
            )}
          </div>
        </main>
      </div>
    );
}
