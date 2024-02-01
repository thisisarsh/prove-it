import { useEffect } from "react";

import { useLogout } from "../../hooks/useLogout";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { TenantProperty, ServiceRequest } from "../../types";
import  Offcanvas  from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav'

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
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
    };

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            fetch(window.config.SERVER_URL + "/properties-tenant" + "?tenantId=" + user.id, {
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
                window.config.SERVER_URL + "/ticket/tenant/tickets",
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

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1 className="dashboard-title">Dashboard Tenant</h1>
                <button className="menu-toggle-button" onClick={toggleOffcanvas}>
                        ☰
                </button>
            </div>

            {/* Nav Panel */}
            <Offcanvas show={isOffcanvasOpen} onHide={toggleOffcanvas} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>HomeOwner Dashboard</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav>
                    <ul className="nav-list">
                        <li>
                        <Nav.Link onClick={() => navigate("/invite/serviceprovider")}>Invite Service Provider</Nav.Link>
                        </li>
                    </ul>
                    </Nav>
                    <button className="logout-button" onClick={logout}>Log out</button>
                </Offcanvas.Body>
            </Offcanvas>
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
                                    onClick={() => {navigate("/request-service");}}> Request a Service
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
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

