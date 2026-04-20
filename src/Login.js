import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { APP_TITLE } from "./config/appInfo";
import LogoMark from "./components/LogoMark";
import { login, selectAuthError, selectAuthStatus, clearAuthError } from "./store/slices/authSlice";

import "./styles/login/Login.css";

export default function Login() {
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);
  const authStatus = useSelector(selectAuthStatus);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(clearAuthError());
    dispatch(login({ email, password }));
  }

  return (
    <div className="Login">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <LogoMark size={64} glow />
          </div>
          <h1>{APP_TITLE}</h1>
          <p>Sign in to continue</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {authError && <p style={{ color: 'red', marginBottom: 8 }}>{authError}</p>}
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
          <Button
            className="login-button"
            variant="primary"
            block
            size="lg"
            disabled={!validateForm() || authStatus === 'loading'}
            type="submit"
          >
            {authStatus === 'loading' ? 'Signing in…' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
