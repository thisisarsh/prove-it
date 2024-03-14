import { SignUpCluster } from "../clusters/SignUpCluster";

export function InvitedSignup() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <div className="signup-cluster-container">
                <h1>Sign Up</h1>
                <h2>Tenant / Service Provider</h2>
                <p></p>
                <SignUpCluster signupType="invited"/>
            </div>
        </div>
    );
}
