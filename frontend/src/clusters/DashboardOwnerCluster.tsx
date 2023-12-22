/**
 * Dashboard Cluster includes the tables, buttons
 *
 * Sends:
 * Receives:
 */
import { useEffect } from "react";

import { useLogout } from "../hooks/useLogout.tsx";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { Property } from "../types.ts";

import "../styles/pages/dashboard.css";
/**
 *
 * @returns Void
 */
export function DashboardOwnerCluster() {
    const { logout } = useLogout();
    //const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState<Property[] | null>(null);

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(
        null,
    );
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        fetch(import.meta.env.VITE_SERVER + "/properties-owner", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                //console.log(response.json);
                return response.json();
            })
            .then((data) => {
                setIsLoading(false);
                setProperties(data);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    }, [user?.token]);

    //console.log(properties);

    // Function to handle the "Delete" button click
    const handleDeleteClick = (property: Property) => {
        setSelectedProperty(property);
        setShowDeleteConfirmation(true);
    };

    // Function to handle the confirmation of deletion
    const handleConfirmDelete = () => {
        fetch(import.meta.env.VITE_SERVER + "/deleteproperty", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify(selectedProperty),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                //console.log(response.json);
                return response.json();
            })
            .then((responseJson) => {
                //console.log('Backend response:', responseJson);
                if (responseJson.isSuccess) {
                    alert("Successfully Deleted Property");
                    //reload page to show update
                    window.location.reload();
                } else if (!responseJson.isSuccess) {
                    console.log(responseJson);
                    alert(responseJson.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
        //console.log(selectedProperty);

        // After deletion, close the confirmation popup
        setShowDeleteConfirmation(false);
    };

    // Function to handle cancellation of deletion
    const handleCancelDelete = () => {
        // Clear the selected property and close the confirmation popup
        setSelectedProperty(null);
        setShowDeleteConfirmation(false);
    };

    const [isNavPanelVisible, setIsNavPanelVisible] = useState(false);

    // Function to toggle the nav panel
    const toggleNavPanel = () => {
        setIsNavPanelVisible(!isNavPanelVisible);
    };

    return (
    <body>
        <div className="dashboard-container">
            <div className="header">
                <h1 className="dashboard-title">Dashboard Homeowner</h1>
                <button className="menu-toggle-button" onClick={toggleNavPanel}>
                    ☰
                </button>
            </div>

            {/* Nav Panel */}
            <div className={`nav-panel ${isNavPanelVisible ? 'visible' : ''}`}>
                {/* List your navigation options here */}
                <span className="user-icon">👤</span>
                <a href="/addproperty">Add Property</a>
                <a href="/invite/tenant">Invite Tenant</a>
                <a href="/invite/serviceprovider">Invite Service Provider</a>
                <div className="logout-container">
                    <button className="logout-button" onClick={logout}>Log out</button>
                </div>
                {/* Add more links as needed */}
            </div>
                {/* Property block */}
                <div className="properties-container">
                    <h1 className="dashboard-label">Properties</h1>
                    <table className="dashboard-table">
                        <thead className="dashboard-header">
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <td colSpan={2}>Loading Properties...</td>
                            ) : Array.isArray(properties) &&
                                properties.length > 0 ? (
                                properties.map((userProperty) => (
                                    <tr key={userProperty.id}>
                                        <td>{userProperty.name}</td>
                                        <td>{userProperty.streetAddress}</td>
                                        <td>
                                            <button
                                                onClick={() =>
                                                    handleDeleteClick(
                                                        userProperty,
                                                    )
                                                }
                                                className="delete-button"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>
                                        You haven't added any properties yet.
                                        Start by adding a property!
                                    </td>
                                </tr>
                            )}

                            <tr>
                                <td
                                    className="dashboard-empty-property"
                                    colSpan={3}
                                >
                                    <button
                                        className="add-property-button"
                                        onClick={() => {
                                            navigate("/addproperty");
                                        }}>
                                                Add Property
                                        </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Service Request block */}
                <div className="service-container">
                    <h1 className="dashboard-label">Service Requests</h1>
                    <table className="dashboard-table">
                        <tr className="dashboard-header">
                            <th className="dashboard-header">Service</th>
                            <th>Provider</th>
                            <th>Property</th>
                        </tr>
                        <tr>
                            <td className="dashboard-empty-service" colSpan={3}>
                                <button
                                    className="request-service-button"
                                    onClick={() => {
                                        navigate("/servicerequest");
                                    }}>
                                        Request a Service
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
            {/* Nav Panel Overlay */}
                {isNavPanelVisible && (
                <div className="nav-panel-overlay" onClick={toggleNavPanel}></div>
            )}
            {/* Footer */}
            <footer className="dashboard-footer">
                <div className="footer-content">
                    <p>© {new Date().getFullYear()} HomeTrumpeter. All rights reserved.</p>
                    <div className="footer-links">
                        <a href="/privacy-policy">Privacy Policy</a>
                        <a href="/terms-of-service">Terms of Service</a>
                        <a href="/contact">Contact Us</a>
                    </div>
                </div>
            </footer>

            {/* Delete Confirmation Popup */}
            {showDeleteConfirmation && (
                <div className="delete-confirmation-popup">
                    <p>
                        Are you sure to delete "{selectedProperty?.name}"
                        property?
                    </p>
                    <button onClick={handleConfirmDelete}>Yes</button>
                    <button onClick={handleCancelDelete}>No</button>
                </div>
            )}
        </div>
    </body>
    );
}
