import htLogo from "../assets/ht-logo.svg";
import { AddServiceCluster } from "../clusters/service-provider/AddServiceCluster";

export function AddService() {
    return (
        <div className="login-container">
            <img
                src={htLogo}
                className="main-logo"
            />

            <h1>Add a Service</h1>

            <p>Fill out the information below to add a new service offering</p>

            <p>For each service, indicate the typical timeline to complete the service.</p>

            <AddServiceCluster/>
        </div>
    )
}