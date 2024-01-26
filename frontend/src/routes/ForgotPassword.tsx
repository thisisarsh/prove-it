import htLogo from "../assets/ht-logo.svg";
import { Button, Form } from "react-bootstrap";
import "../styles/pages/forgotPassword.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ErrorMessageContainer from "../components/ErrorMessageContainer";
import Spinner from "../components/Spinner";

export function ForgotPassword() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState <string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(window.config.SERVER_URL + '/forgotpassword', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email})
        });
        if (!response.ok) {
            setError(response.statusText);
            setIsLoading(false);
            return;
        }

        const responseJson = await response.json();
        if (responseJson.isSuccess) {
            alert(responseJson.message);
            setIsLoading(false);
            navigate('/login');
        } else {
            setIsLoading(false);
            setError(responseJson.message);
        }
    }

    return (
        <div className="login-container">
            <img src={htLogo} className="main-logo"/>

            <h1>Forgot password?</h1>

            <p>Enter your email below to reset your password</p>

            <Form>
                <Form.Control 
                    className="mb-4"
                    onChange={e => setEmail(e.target.value)}
                />

                {isLoading ? (
                    <Spinner/>
                ) : (
                    <Button 
                    className="submit-button"
                    onClick={handleSubmit}
                    >
                        Reset Password
                    </Button>
                )}
                
            </Form>

            {error && <ErrorMessageContainer message={error}/>}
        </div>
    )
}