import { useEffect, useState } from "react";
import { Assignment } from "../../libs/types";
import { useAuth } from "../../Login/LoginContext";
import { useNavigate } from "react-router-dom";
import { StudentPageNav } from "../../Navbar/StudentPageNav";
import { Button } from "react-bootstrap";

export default function StudentAssignedTasks() {
  const { role, studentID } = useAuth();
  const [assignedTasks, setAssignedTasks] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAssignedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/assignments/assigned");
      if (!response.ok)
        throw new Error(`Server responded with status ${response.status}`);
  
      const data = await response.json();
      console.log(data);
      const filteredTasks = data.filter((task: Assignment) => task.studentId == studentID);
      setAssignedTasks(filteredTasks);
      console.log(filteredTasks);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (role === "Student") {
      fetchAssignedTasks();
    }
  }, [role]);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <StudentPageNav assignments={[]} setFilterAssignments={() => {}} />
      <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
      <div className="row">
            {assignedTasks.map((task) => (
              <div
                className="col-md-6 col-lg-4 mb-4"
                key={task.assignment.id}
              >
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title font-weight-bold text-primary">
                      {task.assignment.subject}
                    </h5>
                    <p className="card-text text-muted">
                      <strong>Korosztály:</strong> {task.assignment.ageGroup}
                      <br />
                      <strong>Leírás:</strong> {task.assignment.description}
                    </p>
                    <Button>Beadás</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </main>
    </div>
  );  
}
