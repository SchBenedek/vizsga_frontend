import { useEffect, useState, useRef } from "react";
import { Assignment } from "../../libs/types";
import { useAuth } from "../../Login/LoginContext";
import { useNavigate } from "react-router-dom";
import { StudentPageNav } from "../../Navbar/StudentPageNav";
import { Button, Modal } from "react-bootstrap";
import { body } from "framer-motion/client";

export default function StudentAssignedTasks() {
  const { role, studentID } = useAuth();
  const [assignedTasks, setAssignedTasks] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const acceptedFileExtensions = ["jpg", "png", "jpeg", "pdf", "docx"];
  const [assignmId, setAssignmId] = useState<Number>();

  useEffect(() => {
    if (role === "Student") {
      fetchAssignedTasks();
    }
  }, []);

  const fetchAssignedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/assignments/assigned");
      if (!response.ok) throw new Error(`Server responded with status ${response.status}`);

      const data = await response.json();
      console.log(data);
      const filteredTasks = data.filter((task: Assignment) => task.studentId == studentID && !task.completed);
      setAssignedTasks(filteredTasks);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (assignmentId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/assignments/${studentID}/${assignmentId}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      setAssignedTasks(prevTasks => prevTasks.filter(task => task.assignment.id !== assignmentId));
      setShowModal(true);
      setAssignmId(assignmentId);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleFileDelete = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setError("File is required");
      return;
    }
    
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("studentId", studentID.toString());
    formData.append("assignmentId", assignmId.toString())
    
    try {
      const response = await fetch("http://localhost:3000/assignments/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }
      
      setSelectedFiles([]);
      setError(null);
      setShowModal(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleCustomButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <StudentPageNav assignments={[]} setFilterAssignments={() => {}} />
      <main className="container-fluid p-4 overflow-auto" style={{ flexGrow: 1 }}>
        <div className="row">
          {assignedTasks.map((task) => (
            <div className="col-md-6 col-lg-4 mb-4" key={task.assignment.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title font-weight-bold text-primary">{task.assignment.subject}</h5>
                  <p className="card-text text-muted">
                    <strong>Korosztály:</strong> {task.assignment.ageGroup}
                    <br />
                    <strong>Leírás:</strong> {task.assignment.description}
                  </p>
                  <Button onClick={() => completeTask(task.assignment.id)}>Beadás</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Fájl feltöltés</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button variant="primary" onClick={handleCustomButtonClick} className="mb-3">
            Válassz fájlt
          </Button>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={acceptedFileExtensions.map(ext => `.${ext}`).join(",")}
            style={{ display: "none" }}
          />
          {selectedFiles.length > 0 && (
            <ul className="mt-3">
              {selectedFiles.map((file, index) => (
                <li key={index} className="d-flex justify-content-between align-items-center">
                  {file.name}
                  <Button variant="danger" size="sm" onClick={() => handleFileDelete(index)}>X</Button>
                </li>
              ))}
            </ul>
          )}
          {error && <p className="text-danger mt-2">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Mégse</Button>
          <Button variant="primary" onClick={handleSubmit}>Feltöltés</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
