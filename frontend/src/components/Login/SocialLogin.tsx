import React from "react";
import { Button } from "react-bootstrap";

function SocialLogin() {
  return (
    <div className="text-center mb-3">
      <p>Sign in with:</p>
      <div className="d-flex justify-content-center gap-2">
        <Button variant="link" className="btn-floating mx-1">
          <i className="fab fa-facebook-f"></i>
        </Button>
        <Button variant="link" className="btn-floating mx-1">
          <i className="fab fa-google"></i>
        </Button>
        <Button variant="link" className="btn-floating mx-1">
          <i className="fab fa-twitter"></i>
        </Button>
        <Button variant="link" className="btn-floating mx-1">
          <i className="fab fa-github"></i>
        </Button>
      </div>
    </div>
  );
}

export default SocialLogin;
