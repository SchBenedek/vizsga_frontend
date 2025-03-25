import { useEffect, useState } from "react";
import { useAuth } from "../../Login/LoginContext";
import { Student } from "../../libs/types";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ChoosenStudent() {
  const { role } = useAuth();
  const [student, setStudent] = useState<Student>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("authToken");
  const id = localStorage.getItem("choosenStudent");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "Teacher") return;

    fetch(`http://localhost:3000/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        return response.json();
      })
      .then((data: Student) => {
        console.log("Fetched students:", data);
        setStudent(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [role, token]);

  const handleAssignment = () => {
    localStorage.setItem("isAssignmentChoice", "true");
    const name = `${student?.firstName} ${student?.lastName}`
    localStorage.setItem("studentName", name)
    navigate('/assigments');
  }

  if (role !== "Teacher")
    return <p>Unauthorized: Only teachers can view this page.</p>;
  if (loading) return <p>Loading students...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <TeacherPageNav assignments={[]} setFilterAssignments={() => []} />
      <main
        className="container-fluid p-4 overflow-auto"
        style={{ flexGrow: 1 }}
      >
        <div className="card">
          <div className="card-body">
            <h5 className="card-title text-primary">
              {student?.firstName} {student?.lastName}
            </h5>
            <p className="card-text">
                <strong>E-mail: </strong> {student?.email}
              <br />
              <strong>Korosztály:</strong> {student?.student.ageGroup}
            </p>
            <Button onClick={() => {handleAssignment()}}>
                Feladat
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
