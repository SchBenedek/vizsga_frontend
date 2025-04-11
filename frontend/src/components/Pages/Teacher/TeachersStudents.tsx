import { useEffect, useState } from "react";
import { useAuth } from "../../Login/LoginContext";
import { Student } from "../../libs/types";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";
import { useNavigate } from "react-router-dom";

export default function TeacherStudents() {
  const { role } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "Teacher") return;

    fetch(`http://localhost:3000/users/students`, {
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
      .then((data: Student[]) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [role, token]);

  const handleClick = (id: number) => {
    localStorage.setItem("choosenStudent", id.toString());
    navigate("/choosenStudent");
  };

  if (role !== "Teacher")
    return <p>Unauthorized: Only teachers can view this page.</p>;
  if (loading) return <p>Loading students...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      className="d-flex"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <TeacherPageNav assignments={[]} setFilterAssignments={() => []} />

      <main
        className="container-fluid p-4 overflow-auto"
        style={{ flexGrow: 1, backgroundColor: "#fff", color: "#212529" }}
      >
        <div className="p-4 rounded shadow alert alert-info">
          <h2 className="text-primary mb-4">Your Students</h2>

          {students.length === 0 ? (
            <p className="text-muted">
              You currently have no students assigned.
            </p>
          ) : (
            <div className="row">
              {students.map((student) => (
                <div
                  className="col-md-6 col-lg-4 mb-4"
                  key={student.id}
                  onClick={() => handleClick(student.id)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body">
                      <h5 className="card-title text-primary mb-2">
                        {student.firstName} {student.lastName}
                      </h5>
                      <p className="card-text text-muted mb-0">
                        <strong>Email:</strong> {student.email}
                      </p>
                      <p className="card-text text-muted">
                        <strong>Age Group:</strong> {student.student.ageGroup}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
