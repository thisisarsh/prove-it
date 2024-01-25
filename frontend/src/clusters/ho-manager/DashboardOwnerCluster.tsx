/**
 * Dashboard Cluster includes the tables, buttons
 *
 * Sends:
 * Receives:
 */
import { useEffect } from "react";
import Modal from 'react-bootstrap/Modal';
import { useLogout } from "../../hooks/useLogout";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Property, PropertyDetail, ServiceRequest } from "../../types";

import "../../styles/pages/dashboard.css";
/**
 *
 * @returns Void
 */
export function DashboardOwnerCluster() {
    const { logout } = useLogout();
    //const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState<Property[] | null>(null);
    const [tickets, setTickets] = useState<ServiceRequest[] | null>(null);
    const [propertyDetail, setPropertyDetail] = useState<PropertyDetail | null>(null);

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(
        null,
    );
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDetail, setShowDetail] = useState(false);

    const [isNavPanelVisible, setIsNavPanelVisible] = useState(false);

    
    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        fetch(window.config.SERVER_URL + "/properties-owner", {
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
                console.log("PROPERTIES");
                console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });

        fetch(window.config.SERVER_URL + "/ticket/manager/tickets", {
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
                setTickets(data);
                console.log("TICKETS");
                console.log(data);
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
        fetch(window.config.SERVER_URL + "/deleteproperty", {
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

    // Function to handle the "Details" button click
    const handleDetailsClick = (property: Property) => {
        
        fetch(window.config.SERVER_URL + "/get-property-details", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify({ id: property.id }),
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
                    setPropertyDetail(responseJson);
                    //console.log(propertyDetail);
                } else if (!responseJson.isSuccess) {
                    console.log(responseJson);
                    alert(responseJson.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
        setSelectedProperty(property);
        setShowDetail(true);
    };

    const handleCloseDetail = () => {
        setSelectedProperty(null);
        setShowDetail(false);
    }

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
                <a onClick={() => navigate("/addproperty")}>Add Property</a>
                <a onClick={() => navigate("/invite/tenant")}>Invite Tenant</a>
                <a onClick={() => navigate("/invite/serviceprovider")}>Invite Service Provider</a>
                <a onClick={() => navigate("/property")}>Property</a>
                <a onClick={() => navigate("/ho/tenants")}>Tenants</a>
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
                                            <button
                                                onClick={() =>
                                                    handleDetailsClick(
                                                        userProperty,
                                                    )
                                                }
                                                className="delete-button"
                                            >
                                                Details
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
                        <thead className="dashboard-header">
                            <tr>
                                <th className="dashboard-header">Service</th>
                                <th>Provider</th>
                                <th>Property</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <td colSpan={2}>Loading Service Requests...</td>
                            ) : Array.isArray(tickets) &&
                                tickets.length > 0 ? (
                                tickets.map((userTicket) => (
                                    <tr key={userTicket.id}>
                                        <td>{userTicket.serviceType.serviceType}</td>
                                        <td>{"Unassigned"}</td>
                                        <td>{userTicket.property.name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>
                                        You don't have any service requests yet.
                                        Start by requesting a service! 
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tr>
                            <td className="dashboard-empty-service" colSpan={3}>
                                <button
                                    className="request-service-button"
                                    onClick={() => {
                                        navigate("/request-service");
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
                        <a onClick={() => navigate("/privacy")}>Privacy Policy</a>
                        <a onClick={() => navigate("/tos")}>Terms of Service</a>
                        <a onClick={() => navigate("/contact")}>Contact Us</a>
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

            {/* Show more detail about property Popup */}
            <Modal show={showDetail} onHide={handleCloseDetail}>
                <Modal.Header closeButton>
                    <Modal.Title>Property Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="property-detail-table">
                        <tbody>
                            {propertyDetail != null ? (
                                <>
                                    <tr>
                                        <td>Property Name: </td>
                                        <td>{propertyDetail.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Street Adress: </td>
                                        <td>{propertyDetail.streetAddress}</td>
                                    </tr>
                                    <tr>
                                        <td>City: </td>
                                        <td>{propertyDetail.cityName}</td>
                                    </tr>
                                    <tr>
                                        <td>County: </td>
                                        <td>{propertyDetail.countyName}</td>
                                    </tr>
                                    <tr>
                                        <td>State: </td>
                                        <td>{propertyDetail.stateName}</td>
                                    </tr>
                                    <tr>
                                        <td>Zip Code: </td>
                                        <td>{propertyDetail.zipcode}</td>
                                    </tr>
                                    <tr>
                                        <td>Property Type: </td>
                                        <td>{propertyDetail.propertyType}</td>
                                    </tr>
                                    <tr>
                                        <td>Rent: </td>
                                        <td>{propertyDetail.rent}</td>
                                    </tr>
                                    <tr>
                                        <td>Is Primary: </td>
                                        <td>{propertyDetail.isPrimary}</td>
                                    </tr>
                                    <tr>
                                        <td>Is Tenant Active: </td>
                                        <td>{propertyDetail.isTenantActive}</td>
                                    </tr>
                                </>
                            ) : (
                                <tr>
                                    <td colSpan={2}>No details available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                <button onClick={handleCloseDetail}>
                    Close
                </button>
                 </Modal.Footer>
      </Modal>
        </div>
    </body>
    );
}

