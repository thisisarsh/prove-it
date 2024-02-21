import { AgreementSubmitCluster } from "../clusters/AgreementSubmitCluster";
import "../styles/pages/addProperty.css";

export function SubmitAgreement() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <AgreementSubmitCluster />
        </div>
    );
}
