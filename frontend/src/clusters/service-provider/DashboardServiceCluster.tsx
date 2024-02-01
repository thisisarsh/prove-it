/**
 * Dashboard Cluster includes the tables, buttons
 *
 * Sends:
 * Receives:
 */
//import { useEffect } from "react";

import { useLogout } from "../../hooks/useLogout";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";

import "../../styles/pages/dashboard.css";
import { DashboardServiceParent, ServiceRequestSP } from "../../types";
import  Tab  from "react-bootstrap/Tab";
import Modal from 'react-bootstrap/Modal';
import ErrorMessageContainer from "../../components/ErrorMessageContainer";
import Spinner from "../../components/Spinner";
import  Offcanvas  from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav'
/**
 *
 * @returns Void
 */
export function DashboardServiceCluster() {
    const { logout } = useLogout();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dashboardServices, setDashboardServices] = useState<DashboardServiceParent[]>([]);
    const [tickets, setTickets] = useState<ServiceRequestSP[] | null>(null);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [ticketDetail, setTicketDetail] = useState<ServiceRequestSP | undefined>(undefined);

    //const [properties, setProperties] = useState<Property[] | null>(null);
    //const [newRequests, setNewRequests] = useState<ServiceRequest[] | null>([]);
    //const [currentRequests, setCurrentRequests] = useState<ServiceRequest[]>([]);
    //const [completedRequests, setCompletedRequests] = useState<ServiceRequest[]>([]);
    const user = useAuthContext().state.user;
    const navigate = useNavigate();
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
    };

    const fetchData = useCallback(
        async (url: string, method = "GET") => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            if (user) {
                headers.append("Authorization", `Bearer ${user.token}`);
            }
            const requestOptions = {
                method: method,
                headers: headers,
            };

            try {
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            } catch (error) {
                console.error("Error:", error);
                setError("An error occured");
                throw error;
            }
        },
        [user],
    );

    useEffect(() => {
        setIsLoading(true);
        fetchData(window.config.SERVER_URL + "/user-services?userId=" + user?.id)
        .then(response => {
            setIsLoading(false);
            if (response.isSuccess) {
                setDashboardServices(response.data);
            } else {
                setError(response.message);
            }
        })
        .catch(error => {
            console.error(error);
            setError('An error occured');
        });

        fetchData(window.config.SERVER_URL + "/sp-service-requests")
        .then(response => {
            setIsLoading(false);
            if (response.isSuccess) {
                setTickets(response.data);
            } else {
                setError(response.message);
            }
        })
        .catch(error => {
            console.error(error);
            setError('An error occured');
        });
    }, [user, fetchData]);

    const handleDetailClick = (id: String) => {
        let ticket: ServiceRequestSP | undefined = tickets?.filter(obj => {
            return(obj.id === id);
        })[0]
        console.log(ticket);
        setTicketDetail(ticket);
        setShowDetail(true);
    }

    const handleCloseDetail = () => {
        setTicketDetail(undefined);
        setShowDetail(false);
    }

    const handleQuoteClick = (ticket: ServiceRequestSP) => {
        navigate("/send-quote", {state: {ticket: ticket}});
    }

    return (
        <div className="dashboard-container">
            <div className="header mb-5">
                <h1 className="dashboard-title">Dashboard Service Provider</h1>
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
                        <Nav.Link onClick={() => navigate("/add-service")}>Add a service</Nav.Link>
                        </li>
                        <li>
                        <Nav.Link onClick={() => navigate("/services")}>Service Request</Nav.Link>
                        </li>
                        <li>
                        <Nav.Link onClick={() => navigate("/clients")}>Clients</Nav.Link>
                        </li>
                        <li>
                        <Nav.Link onClick={() => navigate("/services/complete")}>Completed Request</Nav.Link>
                        </li>
                    </ul>
                    </Nav>
                    <button className="logout-button" onClick={logout}>Log out</button>
                </Offcanvas.Body>
            </Offcanvas>

            {error && <ErrorMessageContainer message={error}/>}
            {isLoading && <Spinner/>}

            {/* New Requests Table */}
            <div className="new-request-container mb-5">
                <h1 className="dashboard-label">New Requests</h1>
                <table className="dashboard-table">
                    <thead className="dashboard-header">
                        <tr>
                            <th>Service</th>
                            <th>Property</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                            {isLoading ? (
                                <td colSpan={2}>Loading Properties...</td>
                            ) : Array.isArray(tickets) &&
                                tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td>{ticket.serviceType.serviceType}</td>
                                        <td>{ticket.property.name}</td>
                                        <td>
                                            <button className="delete-button" onClick={() => handleDetailClick(ticket.id)}>Details</button>
                                            <button className="delete-button" onClick={() => handleQuoteClick(ticket)}>Quote</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>
                                        You have no new service request.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                </table>
            </div>

            {/*My services table*/}
            <div className="request-container mb-5">
                
                <h1 className="dashboard-label">My Services</h1>

                {dashboardServices ? (
                    <Tab.Container defaultActiveKey="0">
                    <Nav variant="tabs" className="custom-tab-header">
                        {dashboardServices.map((dashboardService, index) => (
                            <Nav.Item key={index.toString()} className="custom-tab-link">
                                <Nav.Link eventKey={index.toString()}>{dashboardService.serviceType}</Nav.Link>
                            </Nav.Item>
                            
                        ))}
                        <Nav.Item>
                            <Nav.Link className="add-service-tab" onClick={() => {navigate("/add-service")}}>
                                <span style={{ fontWeight: 'bold' }}>Add a service +</span>
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                    <Tab.Content>
                        {dashboardServices.map((dashboardService, index) => (
                            <Tab.Pane key={index} eventKey={index.toString()} className="custom-tab-content">
                                {dashboardService.childs.map(childService => (
                                    <div key={childService.serviceType}>
                                        {childService.serviceType}
                                        <br/>
                                    </div>
                                ))}
                            </Tab.Pane>
                        ))}
                    </Tab.Content>
                </Tab.Container>
                ) : (
                    <span>
                        You haven't added any services yet! Start by
                        <a className="dashboard-link" onClick={() => {navigate("/add-service")}}> adding a service...</a>
                    </span>
                )}
                
            </div>

            {/* Current Requests Table */}
            <div className="request-container mb-5">
                <h1 className="dashboard-label">Current Requests</h1>
                <table className="dashboard-table">
                    <thead className="dashboard-header">    
                        <tr>
                            <th>Service</th>
                            <th>Property</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={3}>
                                You're not working on any service Request!
                                Accept one to get started.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Completed Requests Table */}
            <div className="request-container mb-5">
                <h1 className="dashboard-label">Completed Requests</h1>
                <table className="dashboard-table">
                    <thead className="dashboard-header">
                        <tr>
                            <th>Service</th>
                            <th>Property</th>
                            <th>Date Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={3}>
                                You have no completed request!
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Show more detail about property Popup */}
            <Modal show={showDetail} onHide={handleCloseDetail}>
                <Modal.Header closeButton>
                    <Modal.Title>Property Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="property-detail-table">
                        <tbody>
                            {ticketDetail != null ? (
                                <>
                                    <tr>
                                        <td>Service Type: </td>
                                        <td>‎ </td>
                                        <td>{ticketDetail.serviceType.serviceType}</td>
                                    </tr>
                                    <tr>
                                        <td>Property Name: </td>
                                        <td>‎ </td>
                                        <td>{ticketDetail.property.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Address: </td>
                                        <td>‎ </td>
                                        <td>{ticketDetail.property.streetAddress}</td>
                                    </tr>
                                    <tr>
                                        <td>Request Date: </td>
                                        <td>‎ </td>
                                        <td>{ticketDetail.createdAt}</td>
                                    </tr>
                                    <tr>
                                        <td>Request Timeline: </td>
                                        <td>‎ </td>
                                        <td>{ticketDetail.timeline.title}</td>
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
                <button className="delete-button" onClick={handleCloseDetail}>
                    Close
                </button>
                </Modal.Footer>
            </Modal>

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