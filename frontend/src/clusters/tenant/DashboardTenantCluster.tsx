import { useEffect } from "react";

import { useLogout } from "../../hooks/useLogout.tsx";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { TenantProperty, ServiceRequest } from "../../types.ts";

import "../../styles/pages/dashboard.css";

/**
 *
 * @returns Void
 */
export function DashboardTenantCluster() {
    const { logout } = useLogout();
    //const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState<TenantProperty[] | null>(null);
    const [tickets, setTickets] = useState<ServiceRequest[] | null>(null);

    //const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    //const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            fetch(import.meta.env.VITE_SERVER + "/properties-tenant" + "?tenantId=" + user.id, {
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
                
            fetch(
                import.meta.env.VITE_SERVER + "/ticket/tenant/tickets",
                {
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
                    return response.json();
                })
                .then((data) => {
                    setIsLoading(false);
                    setTickets(data);
                    console.log("TENANT TICKETS");
                    console.log(data);
                })
                .catch((error) => {
                    console.error("Error fetching data: " + error);
                });
        }
    }, [user, user?.token]);

    const [isNavPanelVisible, setIsNavPanelVisible] = useState(false);

    // Function to toggle the nav panel
    const toggleNavPanel = () => {
        setIsNavPanelVisible(!isNavPanelVisible);
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1 className="dashboard-title">Dashboard Tenant</h1>
                <button className="menu-toggle-button" onClick={toggleNavPanel}>
                    ☰
                </button>
            </div>

            {/* Nav Panel */}
            <div className={`nav-panel ${isNavPanelVisible ? 'visible' : ''}`}>
                {/* List your navigation options here */}
                <span className="user-icon">👤</span>
                <a onClick={() => (navigate("/invite/serviceprovider"))}>Invite Service Provider</a>
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
                                <th>Owner</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <td colSpan={2}>Loading Properties...</td>
                            ) : Array.isArray(properties) &&
                                properties.length > 0 ? (
                                properties.map((userProperty) => (
                                    <tr>
                                        <td>{userProperty.name}</td>
                                        <td>{userProperty.streetAddress}</td>
                                        <td>{userProperty.owner}</td>
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
                                    <tr>
                                        <td>{userTicket.serviceType.serviceType}</td>
                                        <td>{"Unassigned"}</td>
                                        <td>{userTicket.property.name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2}>
                                        You don't have any service requests yet.
                                        Start by requesting a service!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tr>
                            <td className="dashboard-empty-service" colSpan={3}>
                                <button className="request-service-button"
                                    onClick={() => {navigate("/request-service-tenet");}}> Request a Service
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
        </div>
    );
}

