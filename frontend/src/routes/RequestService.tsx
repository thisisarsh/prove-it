import htLogo from "../assets/ht-logo.svg";
import { RequestServiceCluster } from "../clusters/RequestServiceCluster";

export function RequestService() {
    return (
        <div className="login-container">
            <img
                src={htLogo}
                className="main-logo"
            />

            <h1>Request a Service</h1>

            <RequestServiceCluster/>
        </div>
    )
}