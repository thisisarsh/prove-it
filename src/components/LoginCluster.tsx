import { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const LOGIN_ENDPOINT = 'https://api.htuslab1.com/user/login'

async function loginUser(email: String, password: String) {
  return fetch(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then(data => data.json())
 }

export function LoginCluster() {
  const [email, setEmail] = useState(localStorage.getItem("myapp-email") || "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const token = await loginUser(email, password);
    console.log(token);

    // Store user email in local storage as "user-email"
    if(remember && token.statusCode === 200) {
      localStorage.setItem("user-email", email);
    } else {
      localStorage.setItem("user-email", "");
    }
  }

  const handleToggleRemember = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setRemember(!remember);
  }

  return (
    <Form className="login-cluster" onSubmit={handleSubmit}>
      {/* Email input */}
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
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