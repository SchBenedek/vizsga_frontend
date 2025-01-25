import React, { useState } from "react";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";
import SocialLogin from "./SocialLogin";

function RegisterForm() {

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
    const [role, setRole] = useState<string>("teacher");

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const toggleRepeatPasswordVisibility = () => {
        setRepeatPasswordVisible(!repeatPasswordVisible);
    };

    const preventCopy = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    };

    const roles = () => {
        if (role == "teacher") {
            setRole("student")
        }
        else {
            setRole("teacher")
        }
    }

    const email = (<Form.Group className="mb-4" controlId="registerEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="Enter your email" />
        </Form.Group>)

    return (
        <>
            <div className="container">
                <Form>
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-4" controlId="registerName">
                                <Form.Label>Full Name</Form.Label>
                                <Form.Control type="text" placeholder="Enter your name" />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-4" controlId="registerUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter a username" />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-4" controlId="loginRole">
                                <Form.Label>Tanár/Diák</Form.Label>
                                <Form.Control as="select" onChange={roles}>
                                    <option value="teacher">Tanár</option>
                                    <option value="student">Diák</option>
                                </Form.Control>
                            </Form.Group>
                        </div>
                        {role === "teacher" ? (
                            <div className="col-md-6">{email}</div>
                        ) : null}
                        <div className="col-md-6">
                            <Form.Group className="mb-4" controlId="registerPassword">
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="Enter your password"
                                        onCopy={preventCopy}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {passwordVisible ? "Hide" : "Show"}
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-4" controlId="registerRepeatPassword">
                                <Form.Label>Repeat Password</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={repeatPasswordVisible ? "text" : "password"}
                                        placeholder="Enter your password again"
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={toggleRepeatPasswordVisibility}
                                    >
                                        {repeatPasswordVisible ? "Hide" : "Show"}
                                    </Button>
                                </InputGroup>
                            </Form.Group>
                        </div>
                    </div>
                    <SocialLogin />
                    <Button variant="primary" type="submit" className="w-100">
                        Register
                    </Button>
                </Form>
            </div>

        </>
    );
}

export default RegisterForm;
