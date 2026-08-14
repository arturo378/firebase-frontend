import React, { useState, useEffect } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import api from "./config/api";
import { APP_TITLE } from "./config/appInfo";
import LogoMark from "./components/LogoMark";

import "./styles/login/Login.css";

// Mirrors OTP_RESEND_COOLDOWN_SECONDS on the backend. The server silently skips
// a too-early resend rather than reporting it, so gating here is the only way to
// avoid telling the user a code was sent when none actually was.
const RESEND_COOLDOWN_SECONDS = 60;

// Matches the backend password rule (min 8 characters).
const MIN_PASSWORD_LENGTH = 8;

export default function ForgotPassword({ onBackToLogin }) {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetTicket, setResetTicket] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Tick the resend cooldown down to zero, clearing the interval on unmount so
  // leaving the flow mid-countdown doesn't leave a timer running.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown(c => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  async function requestCode(event) {
    if (event) event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post('/api/auth/forgot-password', { email });
      // The response is deliberately identical whether or not the account
      // exists, so it is shown as-is with nothing added.
      setNotice(res.message);
      setCooldown(RESEND_COOLDOWN_SECONDS);
      setOtp("");
      setStep("code");
    } catch (err) {
      setError(err.message || 'Could not send a reset code');
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post('/api/auth/verify-otp', { email, otp });
      setResetTicket(res.resetTicket);
      setNotice("");
      setStep("password");
    } catch (err) {
      setError(err.message || 'Could not verify that code');
    } finally {
      setLoading(false);
    }
  }

  async function submitNewPassword(event) {
    event.preventDefault();
    setError("");

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/reset-password', { resetTicket, password });
      setStep("done");
    } catch (err) {
      setError(err.message || 'Could not reset your password');
    } finally {
      setLoading(false);
    }
  }

  function backToEmailStep() {
    setError("");
    setNotice("");
    setOtp("");
    setStep("email");
  }

  const headings = {
    email: 'Reset your password',
    code: 'Enter your code',
    password: 'Choose a new password',
    done: 'Password updated',
  };

  const subheadings = {
    email: "We'll email you a 6-digit verification code",
    code: `Enter the 6-digit code sent to ${email}`,
    password: 'Pick something you have not used before',
    done: 'Sign in with your new password',
  };

  return (
    <div className="Login">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <LogoMark size={64} glow />
          </div>
          <h1>{APP_TITLE}</h1>
          <p>{headings[step]}</p>
          <p className="login-subheading">{subheadings[step]}</p>
        </div>

        {error && <p className="login-error">{error}</p>}

        {step === "email" && (
          <form className="login-form" onSubmit={requestCode}>
            <FormGroup className="login-field" controlId="reset-email">
              <FormLabel>Email</FormLabel>
              <FormControl
                className="login-input"
                autoFocus
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </FormGroup>
            <Button
              className="login-button"
              variant="primary"
              block
              size="lg"
              disabled={loading || email.length === 0}
              type="submit"
            >
              {loading ? 'Sending…' : 'Send code'}
            </Button>
            <button type="button" className="login-link-button" onClick={onBackToLogin}>
              Back to sign in
            </button>
          </form>
        )}

        {step === "code" && (
          <form className="login-form" onSubmit={verifyCode}>
            {notice && <p className="login-note">{notice}</p>}
            <FormGroup className="login-field" controlId="reset-otp">
              <FormLabel>Verification code</FormLabel>
              <FormControl
                className="login-input login-otp-input"
                autoFocus
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={otp}
                // Strip non-digits so a pasted "418 290" still submits cleanly.
                onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
            </FormGroup>
            <Button
              className="login-button"
              variant="primary"
              block
              size="lg"
              disabled={loading || otp.length !== 6}
              type="submit"
            >
              {loading ? 'Verifying…' : 'Verify code'}
            </Button>
            <button
              type="button"
              className="login-link-button"
              disabled={loading || cooldown > 0}
              onClick={() => requestCode()}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
            </button>
            <button type="button" className="login-link-button" onClick={backToEmailStep}>
              Use a different email
            </button>
          </form>
        )}

        {step === "password" && (
          <form className="login-form" onSubmit={submitNewPassword}>
            <FormGroup className="login-field" controlId="reset-password">
              <FormLabel>New password</FormLabel>
              <FormControl
                className="login-input"
                autoFocus
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </FormGroup>
            <FormGroup className="login-field" controlId="reset-confirm-password">
              <FormLabel>Confirm new password</FormLabel>
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
              disabled={loading || !password || !confirmPassword}
              type="submit"
            >
              {loading ? 'Saving…' : 'Set new password'}
            </Button>
          </form>
        )}

        {step === "done" && (
          <div className="login-form">
            <p className="login-success">
              Your password has been reset and every device has been signed out.
            </p>
            <Button
              className="login-button"
              variant="primary"
              block
              size="lg"
              onClick={onBackToLogin}
            >
              Back to sign in
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
