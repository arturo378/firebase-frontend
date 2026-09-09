import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { APP_TITLE } from "./config/appInfo";
import LogoMark from "./components/LogoMark";
import { register, selectAuthError, selectAuthStatus, clearAuthError } from "./store/slices/authSlice";

import "./styles/login/Login.css";

// Matches the backend password rule (min 8 characters).
const MIN_PASSWORD_LENGTH = 8;

export default function Register({ onBackToLogin }) {
  const dispatch = useDispatch();
  const authError = useSelector(selectAuthError);
  const authStatus = useSelector(selectAuthStatus);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [clientCode, setClientCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  function validateForm() {
    return (
      fullname.length > 0 &&
      username.length > 0 &&
      email.length > 0 &&
      clientCode.length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLocalError("");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setLocalError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    dispatch(clearAuthError());
    dispatch(register({ name: fullname, username, fullname, email, password, clientCode }));
  }

  const shownError = localError || authError;

  return (
    <div className="Login">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <LogoMark size={64} glow />
          </div>
          <h1>{APP_TITLE}</h1>
          <p>Create your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {shownError && <p className="login-error">{shownError}</p>}
          <FormGroup className="login-field" controlId="register-fullname">
            <FormLabel>Full Name</FormLabel>
            <FormControl
              className="login-input"
              autoFocus
              value={fullname}
              onChange={e => setFullname(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="login-field" controlId="register-username">
            <FormLabel>Username</FormLabel>
            <FormControl
              className="login-input"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="login-field" controlId="register-email">
            <FormLabel>Email</FormLabel>
            <FormControl
              className="login-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="login-field" controlId="register-client-code">
            <FormLabel>Client Code</FormLabel>
            <FormControl
              className="login-input"
              value={clientCode}
              onChange={e => setClientCode(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="login-field" controlId="register-password">
            <FormLabel>Password</FormLabel>
            <FormControl
              className="login-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </FormGroup>
          <FormGroup className="login-field" controlId="register-confirm-password">
            <FormLabel>Confirm Password</FormLabel>
            <FormControl
              className="login-input"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
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
            {authStatus === 'loading' ? 'Creating account…' : 'Create account'}
          </Button>
          <button type="button" className="login-link-button" onClick={onBackToLogin}>
            Back to sign in
          </button>
        </form>
      </div>
    </div>
  );
}
