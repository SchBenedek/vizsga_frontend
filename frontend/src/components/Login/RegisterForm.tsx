import React, { useEffect, useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { Level, Subjects } from "../libs/types";
import { useAuth } from "./LoginContext";

function RegisterForm() {
  const navigate = useNavigate();
  const [localRole, setLocalRole] = useState<string>("teacher");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [subjectTeacher, setSubjectTeacher] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const {
    role,
    setRole,
    setIsLoggedIn,
    setTeacherId,
    setStudentId,
    setTeacherSubject,
  } = useAuth();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleRepeatPasswordVisibility = () =>
    setRepeatPasswordVisible(!repeatPasswordVisible);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      alert("A jelszavak nem egyeznek.");
      return;
    }

    try {
      const user = {
        firstName,
        lastName,
        email,
        password,
        role: role === "teacher" ? "Teacher" : "Student",
      };

      let bodyData;

      if (role === "teacher") {
        bodyData = {
          firstName,
          lastName,
          email,
          password,
          role: "Teacher",
          subject: subjectTeacher as Subjects,
          hourlyRate: parseInt(hourlyRate),
          rating: 0,
        };
      } else {
        bodyData = {
          firstName,
          lastName,
          email,
          password,
          role: "Student",
          ageGroup: ageGroup,
        };
      }

      const response = await fetch(`http://localhost:3000/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Sikertelen regisztráció.");
      const req = await fetch("http://localhost:3000/auth/self", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      });
      const self = await req.json();
      localStorage.setItem("authToken", data.token);
      setRole(self.role);
      setLocalRole(self.role);
      setIsLoggedIn(true);

      if (self.role === "Teacher") {
        setTeacherSubject(self.subject);
        localStorage.setItem("token", self.token);
        setTeacherId(self.id);
        setTimeout(() => navigate("/teachers/dashboard"), 0);
      }
      if (self.role === "Student") {
        localStorage.setItem("token", self.token);
        setStudentId(self.id);
        navigate("/studentmain");
      }
      navigate("/");
    } catch (error) {
      alert("Hiba történt a regisztráció során.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col md={12}>
          {" "}
          <Form.Group>
            <Form.Label>Tanár/Diák</Form.Label>
            <Form.Control
              as="select"
              value={role?.toString()}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="teacher">Tanár</option>
              <option value="student">Diák</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Vezetéknév</Form.Label>
            <Form.Control
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Vezetéknév"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Keresztnév</Form.Label>
            <Form.Control
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Keresztnév"
            />
          </Form.Group>
        </Col>
        <Col md={6}>
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
          </Col>
      </Row>

      {role === "teacher" ? (
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Tanított tantárgy</Form.Label>
              <Form.Control
                as="select"
                value={subjectTeacher}
                onChange={(e) => setSubjectTeacher(e.target.value)}
                required
              >
                <option value="">Válassz tantárgyat</option>
                <option value="Maths">Matematika</option>
                <option value="History">Történelem</option>
                <option value="Literature">Irodalom</option>
                <option value="English">Angol</option>
                <option value="Science">Természetismeret</option>
                <option value="Compsci">Informatika</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Óradíj</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  required
                  placeholder="Óradíj"
                />
                <InputGroup.Text className="bg-dark text-white">Ft</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Col>
        </Row>
      ) : (
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Életkor csoport</Form.Label>
              <Form.Control
                as="select"
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value)}
                required
              >
                <option value="">Válassz korcsoportot</option>
                <option value="Elementary">Alsó tagozat</option>
                <option value="Secondary">Felső tagozat</option>
                <option value="High">Középiskola</option>
                <option value="University">Egyetem</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
      )}

      <Row className="mb-3">
        <Col md={6}>
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
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <i className="fa fa-eye" style={{ color: "white" }}></i>
                ) : (
                  <i className="fa fa-eye" style={{ color: "#0d6efd" }}></i>
                )}
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6}>
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
              <Button
                variant="outline-secondary"
                onClick={toggleRepeatPasswordVisibility}
              >
                {repeatPasswordVisible ? (
                  <i className="fa fa-eye" style={{ color: "white" }}></i>
                ) : (
                  <i className="fa fa-eye" style={{ color: "#0d6efd" }}></i>
                )}
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      <Button type="submit" className="w-50 mt-3">
        Regisztrálok
      </Button>
    </Form>
  );
}

export default RegisterForm;
