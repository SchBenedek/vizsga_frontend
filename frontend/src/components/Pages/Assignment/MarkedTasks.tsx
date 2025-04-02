import { useEffect, useState } from "react";
import { useAuth } from "../../Login/LoginContext";
import { Assignment, MarkedAssignment } from "../../libs/types";
import { StudentPageNav } from "../../Navbar/StudentPageNav";

export default function MarkedTasks() {
  const [markedAssignments, setMarkedAssignments] = useState<
    MarkedAssignment[]
  >([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { studentID } = useAuth();

  useEffect(() => {
    async function fetchMarkedAssignments() {
      try {
        const response = await fetch(
          `http://localhost:3000/assignments/${studentID}/getMark`
        );
        const data = await response.json();
        setMarkedAssignments(data);

        // Fetch assignments using assignment IDs
        const assignmentIds = data.map(
          (item: MarkedAssignment) => item.assignmentId
        );
        const assignmentPromises = assignmentIds.map((id: number) =>
          fetch(`http://localhost:3000/assignments/${id}`).then((res) =>
            res.json()
          )
        );
        const assignmentData = await Promise.all(assignmentPromises);
        setAssignments(assignmentData);
      } catch (error) {
        console.error(
          "Error fetching marked assignments or assignments:",
          error
        );
      } finally {
        setLoading(false);
      }
    }
    fetchMarkedAssignments();
  }, [studentID]);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <StudentPageNav assignments={[]} setFilterAssignments={() => {}} />
      <main
        className="container-fluid p-4 overflow-auto"
        style={{ flexGrow: 1 }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : markedAssignments.length > 0 ? (
          <div className="row">
            {markedAssignments.map((assignment) => {
              const assignmentDetails = assignments.find(
                (a) => a.id === assignment.assignmentId
              );
              return (
                <div
                  className="col-md-6 col-lg-4 mb-4"
                  key={assignment.assignmentId}
                >
                  <div className="card shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title font-weight-bold text-primary">
                        {assignmentDetails?.name}
                      </h5>
                      <p className="card-text text-muted">
                        <strong>Subject:</strong> {assignmentDetails?.subject}
                        <br />
                        <strong>Description:</strong>{" "}
                        {assignmentDetails?.description}
                        <br />
                        <strong>Mark:</strong> {assignment.mark}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No marked assignments found.</p>
        )}
      </main>
    </div>
  );
}
