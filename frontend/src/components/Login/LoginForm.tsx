import React, { useState } from "react";
import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import { useAuth } from "../Login/LoginContext";
import { useNavigate } from "react-router-dom";
import SocialLogin from "./SocialLogin";

function LoginForm() {
  const { setRole, setIsLoggedIn, setTeacherId, setStudentId } = useAuth();
  const navigate = useNavigate();
  const [localRole, setLocalRole] = useState<string>("teacher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
  
    try {
      const roleEndpoint = localRole === "teacher" ? "teachers" : "students";
      const response = await fetch(`http://localhost:3000/${roleEndpoint}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      if (!response.ok) throw new Error(data.message || "Login failed");
  
      setRole(localRole);
      setIsLoggedIn(true);
  
      if (localRole === "teacher") {
        localStorage.setItem("token", data.token);
        setTeacherId(data.teacherId);
        setTimeout(() => navigate("/teachermain"), 0);
      }
      if (localRole === "student") {
        localStorage.setItem("token", data.token);
        setStudentId(data.studentID);
        navigate("/studentmain");
      }
  
    } catch (error:any) {
      console.error("Login error:", error);
      setError(error.message || "Hibás email vagy jelszó.");
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group>
        <Form.Label>Oldal tanároknak</Form.Label>
        <Form.Control
          as="select"
          value={localRole}
          onChange={(e) => setLocalRole(e.target.value)}
        >
          <option value="teacher">Tanár</option>
          <option value="student">Diák</option>
        </Form.Control>
      </Form.Group>

        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email cím"
          />
        </Form.Group>

      <Form.Group>
        <Form.Label>Jelszó</Form.Label>
        <InputGroup>
          <Form.Control
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Jelszó"
          />
          <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
            {passwordVisible ? <i className="fa fa-eye" style={{color: 'white'}}></i> : <i className="fa fa-eye" style={{ color: '#0d6efd'}}></i>}
          </Button>
        </InputGroup>
      </Form.Group>
      
      <SocialLogin />
      <Button type="submit">Bejelentkezés</Button>
    </Form>
  );
}

export default LoginForm;
