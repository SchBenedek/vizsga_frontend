import { useEffect, useState } from "react";
import { TeacherPageNav } from "../../Navbar/TeacherPageNav";
import { Assignment } from "../../libs/types";
import { Button, Form } from "react-bootstrap";

export default function TurnedInTasks() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returnedTasks, setReturnedTasks] = useState<Assignment[]>([]);
  const [mark, setMark] = useState<number | "">("");

  const fetchReturnedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/assignments/assigned`
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
          (file: any) => file.assignmentId === task.assignment.id
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

  const addMark = async (studentId: number, assignmentId: number, mark: number) => {
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
      <main
        className="container-fluid p-4 overflow-auto"
        style={{ flexGrow: 1 }}
      >
        <div className="row">
          {returnedTasks.length === 0 ? (
            <p>No tasks have been turned in yet.</p>
          ) : (
            returnedTasks.map((task) => (
              <div className="col-md-6 col-lg-4 mb-4" key={task.assignment.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title font-weight-bold text-primary">
                      {task.assignment.subject}
                    </h5>
                    <p className="card-text text-muted">
                      <strong>Korosztály:</strong> {task.assignment.ageGroup}
                      <br />
                      <strong>Leírás:</strong> {task.assignment.description}
                      <br />
                      <span className="text-success">✔ Beadva</span>
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
                        variant="primary"
                        className="mt-2"
                      >
                        {file.fileName}
                      </Button>
                    ))}
                    <hr />
                    {task.mark != 0 ? (
                          <h6 className="mt-2">
                            <strong>Osztályzat:</strong> {task.mark}
                          </h6>
                        ) : (
                          <Form className="mt-2">
                            <Form.Group controlId={`markInput`}>
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
                                addMark(task.studentId, task.assignment.id, Number(mark))
                              }
                            >
                              Osztályzat adása
                            </Button>
                          </Form>
                        )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
