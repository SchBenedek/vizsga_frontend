import React, { useState } from "react";
import { Form, Button, InputGroup, FormGroup } from "react-bootstrap";
import SocialLogin from "./SocialLogin";

function LoginForm() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className="container">
        <Form>
          <Form.Group className="mb-4" controlId="loginEmail">
            <Form.Label>Email or Username</Form.Label>
            <Form.Control type="email" placeholder="Enter your email or username" />
          </Form.Group>

          <Form.Group className="mb-4" controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
              />
              <Button
                variant="outline-secondary"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? "Hide" : "Show"}
              </Button>
            </InputGroup>
          </Form.Group>
          <FormGroup className="mb-4" controlId="loginRole">
            <Form.Label>Tanár/Diák</Form.Label>
            <Form.Control as={"select"}>
                <option value={"teacher"}>Tanár</option>
                <option value={"student"}>Diák</option>
            </Form.Control>
          </FormGroup>

          <SocialLogin />
          <Button variant="primary" type="submit" className="w-100 mb-4">
            Sign In
          </Button>
        </Form>
      </div>
    </>
  );
}

export default LoginForm;
