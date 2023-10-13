import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export function LoginCluster() {
  return (
    <Form className="login-cluster">
      {/* Email input */}
      <Form.Group className="mb-3" controlId="formGroupEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>

      {/* Password input */}
      <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>

      {/* Remember me */}
      <div className="remember-forgot-container">
          <Form.Check
            type="checkbox"
            id="autoSizingCheck"
            className="mb-2"
            label="Remember me"
          />
          <a href="https://youtu.be/dQw4w9WgXcQ?si=xCkLFrt7q1dP8Bk2">Forgot password?</a>
      </div>

      {/* Buttons */}
      <div className="login-button-container">
        <Button type="submit" className="login-button">
          Login
        </Button>
        <Button type="submit" className="create-account-button">
          Create Account
        </Button>
      </div>
    </Form>
  );
}