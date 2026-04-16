import React, { useState } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import api from "./config/api";
import { APP_TITLE } from "./config/appInfo";

import "./styles/login/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="Login">
      <div className="login-card">
        <div className="login-header">
          <h1>{APP_TITLE}</h1>
          <p>Sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <p style={{ color: 'red', marginBottom: 8 }}>{error}</p>}
          <FormGroup className="login-field" controlId="email">
            <FormLabel>Email</FormLabel>
            <FormControl
              className="login-input"
              autoFocus
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="login-field" controlId="password">
            <FormLabel>Password</FormLabel>
            <FormControl
              className="login-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
            />
          </FormGroup>
          <Button className="login-button" variant="primary" block size="lg" disabled={!validateForm()} type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}
