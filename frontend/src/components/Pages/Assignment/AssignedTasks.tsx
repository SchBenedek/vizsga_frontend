import { useEffect, useState } from "react";
import { Assignment } from "../../libs/types";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";
import { useAuth } from "../../Login/LoginContext";
import { useNavigate } from "react-router-dom";

export default function AssignedTasks() {
  const { role } = useAuth();
  const [assignedTasks, setAssignedTasks] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchAssignedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:3000/assignments/assigned"
      );
      if (!response.ok)
        throw new Error(`Server responded with status ${response.status}`);

      const data = await response.json();
      setAssignedTasks(data);
      console.log(data);
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

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <TeacherPageNav assignments={[]} setFilterAssignments={() => {}} />
      <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
        <h1>Assigned Tasks</h1>
        <hr></hr>
        <div className="container">
          {Object.entries(
            assignedTasks.reduce((acc, assignedT) => {
              const studentName = `${assignedT.student.user.firstName} ${assignedT.student.user.lastName}`;
              if (!acc[studentName]) acc[studentName] = [];
              acc[studentName].push(assignedT.assignment);
              return acc;
            }, {} as Record<string, typeof assignedTasks>)
          ).map(([studentName, assignments]) => (
            <div key={studentName} className="mb-4">
              <h3 className="text-primary">{studentName}</h3>
              <div className="row">
                {assignments.map((assignment) => (
                  <div className="col-md-6 col-lg-4 mb-3" key={assignment.id}>
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="card-title font-weight-bold text-primary">
                          {assignment.name}
                        </h5>
                        <p className="card-text">{assignment.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );  
}
