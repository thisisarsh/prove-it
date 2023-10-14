import { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

/**
 * Login Cluster includes the input box, buttons, checkboxes
 * 
 * Sends: A payload to the HT login API endpoint
 * Receives: Token containing login status (success/fail)
 */

const LOGIN_API = 'https://api.htuslab1.com/user/login'

/**
 * Call HT login API endpoint with user's email & password
 * @param email User's email
 * @param password User's password
 * @returns Payload containing login status
 */
async function loginUser(email: String, password: String) {
  return fetch(LOGIN_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then(data => data.json())
 }

/**
 * Handles login buttons, input boxes, and remember-me button
 * @returns Void
 */
export function LoginCluster() {
  const [email, setEmail] = useState(localStorage.getItem("user-email") || ""); // User email - always retrieve from localStorage if possible
  const [password, setPassword] = useState("");                                 // User password
  const [remember, setRemember] = useState(false);                              // Remember-me button state

  // Handle login button
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const token = await loginUser(email, password); // Call API endpoint
    console.log(token);

    // Store user email in local storage as "user-email"
    if(remember && token.status == 200) {
      localStorage.setItem("user-email", email);
    } else {
      localStorage.setItem("user-email", "");
    }
  }

  // Handle remember-me checkbox
  const handleToggleRemember = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setRemember(!remember);
  }

  return (
    <Form className="login-cluster" onSubmit={handleSubmit}>
      {/* Email input */}
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} value={email} />
      </Form.Group>

      {/* Password input */}
      <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      </Form.Group>

      {/* Remember me */}
      <div className="remember-forgot-container">
          <Form.Check
            type="checkbox"
            id="autoSizingCheck"
            className="mb-2"
            label="Remember me"
            onChange={handleToggleRemember}
          />
          <a href="https://youtu.be/dQw4w9WgXcQ?si=xCkLFrt7q1dP8Bk2">Forgot password?</a>
      </div>

      {/* Buttons */}
      <div className="login-button-container">
        <Button type="submit" className="login-button">
          Login
        </Button>
        <Button className="create-account-button" href="https://www.google.ca">
          Create Account
        </Button>
      </div>
    </Form>
  );
}