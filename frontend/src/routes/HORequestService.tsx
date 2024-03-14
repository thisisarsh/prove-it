import htLogo from "../assets/ht-logo.svg";
import { RequestHOServiceCluster } from "../clusters/ho-manager/HORequestServiceCluster";
import { useNavigate } from "react-router-dom";

export function HORequestService() {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <img
                src={htLogo}
                className="main-logo"
                onClick={() => navigate("/dashboard")}
            />
            <RequestHOServiceCluster />
        </div>
    );
}
