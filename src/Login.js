import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import fire from "./config/fire";
import { APP_TITLE } from "./config/appInfo";

import "./styles/login/Login.css";

const DEMO_MODE = localStorage.getItem('demoMode') === 'true';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    fire.auth().signInWithEmailAndPassword(email,password).then((u)=>{
        console.log(u)
    }).catch((err)=>{
        console.log(err);
    })
  }

  function handleDemoSignIn() {
    fire.auth().signInWithEmailAndPassword('demo@demo.com', 'demo');
  }

  function enterDemoMode() {
    localStorage.setItem('demoMode', 'true');
    window.location.reload();
  }

  function exitDemoMode() {
    localStorage.removeItem('demoMode');
    window.location.reload();
  }

  if (DEMO_MODE) {
    return (
      <div className="Login">
        <div className="login-card">
          <div className="login-header">
            <h1>{APP_TITLE}</h1>
            <div className="demo-badge">DEMO MODE</div>
            <p>Explore the app with sample data — no account needed.</p>
          </div>
          <div className="login-form">
            <Button
              className="login-button"
              variant="primary"
              block
              onClick={handleDemoSignIn}
            >
              Enter Demo
            </Button>
            <Button
              className="login-button demo-exit-button"
              variant="outline-secondary"
              block
              onClick={exitDemoMode}
            >
              Exit Demo Mode
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="Login">
      <div className="login-card">
        <div className="login-header">
          <h1>{APP_TITLE}</h1>
          <p>Sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <FormGroup className="login-field" controlId="email" bsSize="large">
            <FormLabel>Email</FormLabel>
            <FormControl
              className="login-input"
              autoFocus
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="login-field" controlId="password" bsSize="large">
            <FormLabel>Password</FormLabel>
            <FormControl
              className="login-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
            />
          </FormGroup>
          <Button className="login-button" variant="primary" block bsSize="large" disabled={!validateForm()} type="submit">
            Login
          </Button>
          <div className="demo-divider">
            <span>or</span>
          </div>
          <Button
            className="login-button demo-mode-button"
            variant="outline-secondary"
            block
            onClick={enterDemoMode}
          >
            Try Demo Mode
          </Button>
        </form>
      </div>
    </div>
  );
}