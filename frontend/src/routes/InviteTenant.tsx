import InviteTenantCluster from "../components/InviteTenantCluster.tsx";
import '../styles/pages/addProperty.css';

export function InviteTenant() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />

            <h1>Invite a Tenant</h1>
            
            <InviteTenantCluster />
        </div>
    );
}