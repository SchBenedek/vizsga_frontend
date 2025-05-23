import { useEffect, useState } from "react";
import { Assignment } from "../../libs/types";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";
import { useAuth } from "../../Login/LoginContext";
import { useNavigate } from "react-router-dom";

export default function TeacherAssignedTasks() {
  const { role, teacherID } = useAuth();
  const [assignedTasks, setAssignedTasks] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchAssignedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:3000/assignments/assigned",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok)
        throw new Error(`Server responded with status ${response.status}`);

      const data = await response.json();
      const filteredTasks = data.filter(
        (task: Assignment) =>
          task.student.user.sTeacherId == teacherID && !task.completed
      );
      setAssignedTasks(filteredTasks);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "Teacher") {
      fetchAssignedTasks();
    }
  }, [role]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      className="d-flex"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <TeacherPageNav assignments={[]} setFilterAssignments={() => {}} />
      <main
        className="container-fluid p-4 overflow-auto"
        style={{ flexGrow: 1, backgroundColor: "#fff", color: "#212529" }}
      >
        {assignedTasks.length > 0 ? (
          <>
            <div className="p-4 rounded shadow alert alert-info">
              <h2 className="mb-3 text-dark">Kiosztott feladatok</h2>
            </div>

            <hr />
            <div className="container">
              {Object.entries(
                assignedTasks.reduce((acc, assignedT) => {
                  const studentName = `${assignedT.student.user.firstName} ${assignedT.student.user.lastName}`;
                  if (!acc[studentName]) acc[studentName] = [];
                  acc[studentName].push(assignedT.assignment);
                  return acc;
                }, {} as Record<string, typeof assignedTasks>)
              ).map(([studentName, assignments]) => (
                <div key={studentName} className="mb-5">
                  <h4 className="text-primary mb-3">{studentName}</h4>
                  <div className="row">
                    {assignments.map((assignment) => (
                      <div
                        className="col-md-6 col-lg-4 mb-4"
                        key={assignment.id}
                      >
                        <div className="card shadow-sm h-100 border-0">
                          <div className="card-body">
                            <h5 className="card-title text-primary">
                              {assignment.name}
                            </h5>
                            <p className="card-text text-muted">
                              {assignment.description ||
                                "Nincs leírás megadva."}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center mt-5">
            <div className="alert alert-info p-4 shadow-sm" role="alert">
              <p className="display-1">😇</p>
              <h4 className="alert-heading text-primary">
                Nincs kiadott feladat!
              </h4>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
