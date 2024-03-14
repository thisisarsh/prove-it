import { SignUpCluster } from "../clusters/SignUpCluster";

/**
 * Signup page
 * "/signup"
 */
export function SignUp() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <div className="signup-cluster-container">
                <h1>Sign Up</h1>
                <h2>Homeowner / Manager</h2>
                <p></p>
                <SignUpCluster signupType="manager"/>
            </div>
        </div>
    );
}
