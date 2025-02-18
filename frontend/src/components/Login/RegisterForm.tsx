import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SocialLogin from "./SocialLogin";

function RegisterForm() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("teacher");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleRepeatPasswordVisibility = () => {
    setRepeatPasswordVisible(!repeatPasswordVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      alert("Passwords do not match");
      return;
    }
  
    try {
      const roleEndpoint = role === "teacher" ? "teachers" : "students";
      const bodyData = { name, email, password, ageGroup, assignmentId : Number(assignmentId) };
  
      const response = await fetch(`http://localhost:3000/${roleEndpoint}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");
  
      console.log("Registration successful:", data);
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
    }
  };  

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Teljes név</Form.Label>
        <Form.Control
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Név"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Tanár/Diák</Form.Label>
        <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="teacher">Tanár</option>
          <option value="student">Diák</option>
        </Form.Control>
      </Form.Group>

      <Form.Group>
        <Form.Label>Életkor csoport</Form.Label>
        <Form.Control
          type="text"
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          required
          placeholder="Pl: 18-25"
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Assignment ID</Form.Label>
        <Form.Control
          type="number"
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
          required
          placeholder="Assignment ID"
        />
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
            {passwordVisible ? <i className="fa fa-eye" style={{ color: 'white' }}></i> : <i className="fa fa-eye" style={{ color: '#0d6efd' }}></i>}
          </Button>
        </InputGroup>
      </Form.Group>

      <Form.Group>
        <Form.Label>Jelszó megerősítése</Form.Label>
        <InputGroup>
          <Form.Control
            type={repeatPasswordVisible ? "text" : "password"}
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
            placeholder="Jelszó újra"
          />
          <Button variant="outline-secondary" onClick={toggleRepeatPasswordVisibility}>
            {repeatPasswordVisible ? <i className="fa fa-eye" style={{ color: 'white' }}></i> : <i className="fa fa-eye" style={{ color: '#0d6efd' }}></i>}
          </Button>
        </InputGroup>
      </Form.Group>

      <SocialLogin />
      <Button type="submit">Regisztrálok</Button>
    </Form>
  );
}

export default RegisterForm;
