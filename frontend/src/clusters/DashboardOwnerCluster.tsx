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

    return (
        <div className="dashboard-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="dashboard-logo"
            />

            {/* logout button */}
            <button className="logout-button" onClick={logout}>
                Log out
            </button>
            <h1 className="dashboard-title">Dashboard</h1>

            {/* left side of dashboard for inline-block */}
            <div className="dashboard-left-side">
                {/* Property block */}
                <div className="dashboard-table-container">
                    <h1 className="dashboard-label">Properties</h1>
                    <table className="dashboard-table">
                        <thead className="dashboard-header">
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
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
                                    <td colSpan={2}>
                                        You haven't added any properties yet.
                                        Start by adding a property!
                                    </td>
                                </tr>
                            )}

                            <tr>
                                <td
                                    className="dashboard-empty-property"
                                    colSpan={2}
                                >
                                    <a
                                        className="dashboard-link"
                                        onClick={() => {
                                            navigate("/addproperty");
                                        }}
                                    >
                                        Add Property...
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Service Request block */}
                <div className="dashboard-table-container">
                    <h1 className="dashboard-label">Service Requests</h1>
                    <table className="dashboard-table">
                        <tr className="dashboard-header">
                            <th className="dashboard-header">Service</th>
                            <th>Provider</th>
                            <th>Property</th>
                        </tr>
                        <tr>
                            <td className="dashboard-empty-service" colSpan={3}>
                                <a href="https://youtu.be/dQw4w9WgXcQ?si=xCkLFrt7q1dP8Bk2">
                                    Request a Service
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            {/* tip block */}
            <div className="tip-table-container">
                <table className="tip-table">
                    <tr className="dashboard-tip-header">
                        <th>Tips</th>
                    </tr>
                    <tr>
                        <td>
                            You dont have any property added.{" "}
                            <a href="https://youtu.be/dQw4w9WgXcQ?si=xCkLFrt7q1dP8Bk2">
                                Start by adding a property
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <a
                                onClick={() => {
                                    navigate("/invite/tenant");
                                }}
                            >
                                Invite a tenant
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <a
                                onClick={() => {
                                    navigate("/invite/serviceprovider");
                                }}
                            >
                                Invite a service provider
                            </a>
                        </td>
                    </tr>
                </table>
            </div>

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
    );
}