/**
 * Login Cluster includes the input box, buttons
 * 
 * Sends: A payload to the HT signup API endpoint
 * Receives: Token containing signup status (success/fail)
 */
import { useState } from 'react';
import { useSignUp } from '../hooks/useSignup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

/**
 * Handles signup buttons, input boxes
 * @returns Void
 */
export function SignUpCluster() {
  const [firstName, setFirstName] = useState("");   // User first name - always retrieve from localStorage if possible
  const [lastName, setLastName] = useState("");             //// User last name - always retrieve from localStorage if possible
  const [email, setEmail] = useState(""); // User email - always retrieve from localStorage if possible
  const [password, setPassword] = useState("");                                 // User password
  const [confirmPassword, setConfirmPassword] = useState("");                          // User confirm password
  const {signup, error, isLoading} = useSignUp();

  // Handle signup button
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    await signup(lastName, firstName, email, password, confirmPassword); // Call API endpoint
    
    // Store user email, first namd and last name in local storage
    if(!error) {
      localStorage.setItem("user-email", email);
      localStorage.setItem("user-first-name", firstName);
      localStorage.setItem("user-last-name", lastName);
    } else {
      localStorage.removeItem("user-email");
      localStorage.removeItemItem("user-first-name");
      localStorage.removeItemItem("user-last-name");
    }
  }

  return (
    <Form className="login-cluster" onSubmit={handleSubmit}>
      {/* first name input */}
      <Form.Group className="mb-3" controlId="formGroupFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" placeholder="Enter First Name" onChange={e => setFirstName(e.target.value)} value={firstName} />
      </Form.Group>

      {/* last name input */}
      <Form.Group className="mb-3" controlId="formGroupLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control type="text" placeholder="Enter Last Name" onChange={e => setLastName(e.target.value)} value={lastName} />
      </Form.Group>

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

      {/* Password Confirm input */}
      <Form.Group className="mb-3" controlId="formGroupPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} />
      </Form.Group>

      {/* Buttons */}
      <div className="sign-up-button-container">
        <Button type="submit" className="sign-up-button">
          Sign Up
        </Button>
      </div>
    </Form>
  );
}