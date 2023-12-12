import InviteUserCluster from "../components/InviteUserCluster.tsx";
import '../styles/pages/addProperty.css';

export function InviteServiceProvider() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />

            <h1>Invite a Service Provider</h1>
            
            <InviteUserCluster roleName="service_provider"/>
        </div>
    );
}