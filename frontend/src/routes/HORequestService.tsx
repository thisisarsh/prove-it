import htLogo from "../assets/ht-logo.svg";
import { RequestHOServiceCluster } from "../clusters/ho-manager/HORequestServiceCluster";

export function HORequestService() {
    return (
        <div className="login-container">
            <img
                src={htLogo}
                className="main-logo"
            />

            <h1>Request a Service</h1>

            <RequestHOServiceCluster/>
        </div>
    )
}