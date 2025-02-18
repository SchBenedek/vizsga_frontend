import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import LoginForm from "../Login/LoginForm";
import RegisterForm from "../Login/RegisterForm";

function Startpage() {
  return (
    <main className="d-flex align-items-center justify-content-center vh-100 bg-dark text-light">
      <div className="container text-center">
        <h1 className="mb-4">Tanár-diák weboldal</h1>
        <p className="lead mb-3">Learn once, access always.</p>
        <Tabs defaultActiveKey="login" id="auth-tabs" className="mb-5 nav-pills nav-justified">
          <Tab eventKey="login" title="Bejelentkezés">
            <LoginForm />
          </Tab>
          <Tab eventKey="register" title="Regisztráció">
            <RegisterForm />
          </Tab>
        </Tabs>
      </div>
    </main>
  );
}

export default Startpage;
