import { AddPropertyCluster } from "../components/AddPropertyCluster.tsx";
import '../styles/pages/addProperty.css';

export function AddProperty() {
    return (
        <div className="login-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="main-logo"
            />
            <AddPropertyCluster />
        </div>
    );
}
