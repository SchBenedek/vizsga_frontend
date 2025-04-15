import { useEffect, useState } from "react";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";
import { Assignment } from "../../libs/types";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../../Login/LoginContext";

export default function TurnedInTasks() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returnedTasks, setReturnedTasks] = useState<Assignment[]>([]);
  const [mark, setMark] = useState<number | "">("");
  const { teacherID } = useAuth();

  const fetchReturnedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/assignments/returned/${teacherID}`
      );
      if (!response.ok) throw new Error("Failed to fetch turned-in tasks");

      const tasks = await response.json();

      const filesResponse = await fetch(
        `http://localhost:3000/assignments/files`
      );
      if (!filesResponse.ok) throw new Error("Failed to fetch files");

      const files = await filesResponse.json();

      const tasksWithFiles = tasks.map((task: any) => {
        const assignmentFiles = files.filter(
          (file: any) => file.assignmentId == task.assignment.id
        );
        return {
          ...task,
          uploadedFiles: assignmentFiles,
        };
      });

      setReturnedTasks(tasksWithFiles);
      console.log(tasks);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addMark = async (
    studentId: number,
    assignmentId: number,
    mark: number
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/assignments/${studentId}/${assignmentId}/${mark}/mark`,
        {
          method: "PATCH",
        }
      );
      if (!response.ok) throw new Error("Failed to add mark");
      fetchReturnedTasks();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const downloadFile = async (
    assignmentId: number,
    studentId: number,
    fileName: string
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/assignments/${assignmentId}/${studentId}/files/${fileName}`
      );
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      console.log(blob);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchReturnedTasks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <TeacherPageNav assignments={[]} setFilterAssignments={() => {}} />
      {returnedTasks.length > 0 ? (
        <main
          className="container-fluid p-4 overflow-auto"
          style={{ flexGrow: 1 }}
        >
          <div className="p-4 rounded shadow alert alert-info">
            <h1 className="text-primary">Beadott feladatok</h1>
          </div>
          <div className="row">
            {returnedTasks.map((task) => (
              <div className="col-md-6 col-lg-4 mb-4" key={task.assignment.id}>
                <div className="card shadow-sm h-100 border-0">
                  <div className="card-body">
                    <h5 className="card-title text-primary">
                      {task.assignment.subject}
                    </h5>
                    <p className="card-text text-muted">
                      <strong>Korosztály:</strong> {task.assignment.ageGroup}
                      <br />
                      <strong>Leírás:</strong> {task.assignment.description}
                      <br />
                      <span className="text-success fw-bold">✔ Beadva</span>
                    </p>

                    {task.uploadedFiles?.map((file) => (
                      <Button
                        key={file.fileName}
                        onClick={() =>
                          downloadFile(
                            task.assignment.id,
                            file.studentId,
                            file.fileName
                          )
                        }
                        variant="outline-primary"
                        className="me-2 mb-2"
                      >
                        {file.fileName}
                      </Button>
                    ))}

                    <hr />

                    {task.mark !== 0 ? (
                      <h6 className="mt-2 text-success">
                        <strong>Osztályzat:</strong> {task.mark}
                      </h6>
                    ) : (
                      <Form className="mt-2">
                        <Form.Group
                          controlId={`markInput-${task.assignment.id}`}
                        >
                          <Form.Control
                            type="number"
                            placeholder="Osztályzat"
                            value={mark}
                            onChange={(e) => setMark(Number(e.target.value))}
                          />
                        </Form.Group>
                        <Button
                          variant="primary"
                          className="mt-2"
                          onClick={() =>
                            addMark(
                              task.studentId,
                              task.assignment.id,
                              Number(mark)
                            )
                          }
                        >
                          Osztályzat adása
                        </Button>
                      </Form>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main
          className="container-fluid p-4 overflow-auto"
          style={{ flexGrow: 1 }}
        >
          <div className="text-center mt-5">
            <div className="alert alert-info p-4 shadow-sm" role="alert">
              <p className="display-1">📭</p>
              <h4 className="alert-heading text-primary">
                Nincs beadott feladat!
              </h4>
              <p>
                Még egyik diák sem töltött fel feladatot. Nézz vissza később!
              </p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
