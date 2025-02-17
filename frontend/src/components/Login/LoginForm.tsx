import React, { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useAuth } from "../Login/LoginContext";
import { useNavigate } from "react-router-dom";
import SocialLogin from "./SocialLogin";

function LoginForm() {
  const { setRole, setIsLoggedIn, setTeacherId } = useAuth();
  const navigate = useNavigate();
  const [role, setLocalRole] = useState<string>("teacher");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:3000/${role}s/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
  
      console.log("Login successful:", data);
      setRole(role);
      setIsLoggedIn(true);
  
      localStorage.setItem("token", data.token);
  
      if (role === "teacher") {
        setTeacherId(data.teacherId);
      }
  
      navigate("/teachermain");
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Role</Form.Label>
        <Form.Control
          as="select"
          value={role}
          onChange={(e) => setLocalRole(e.target.value)}
        >
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </Form.Control>
      </Form.Group>

      {role === "teacher" ? (
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </Form.Group>
      ) : (
        <Form.Group>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </Form.Group>
      )}

      <Form.Group>
        <Form.Label>Password</Form.Label>
        <InputGroup>
          <Form.Control
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
            {passwordVisible ? "Hide" : "Show"}
          </Button>
        </InputGroup>
      </Form.Group>
      
      <SocialLogin />
      <Button type="submit">Login</Button>
    </Form>
  );
}

export default LoginForm;
