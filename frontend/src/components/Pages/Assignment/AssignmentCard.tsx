import { useEffect, useState } from "react";
import { Assignment } from "../../libs/types";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";

export default function AssignmentCard() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const id = localStorage.getItem("assignmentId");

  useEffect(() => {
    const fetchAssignment = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3000/assignments/${id}`);
        if (!response.ok)
          throw new Error(`Server responded with status ${response.status}`);

        const data = await response.json();
        setAssignment(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <TeacherPageNav assignments={[]} setFilterAssignments={() => {}}/>
      <div className="container mt-5">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Hiba történt: {error}.</p>
        ) : (
          assignment && (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title text-primary">{assignment.subject}</h5>
                <p className="card-text">
                  <strong>Korosztály:</strong> {assignment.ageGroup}
                  <br />
                  <strong>Leírás:</strong> {assignment.description}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
