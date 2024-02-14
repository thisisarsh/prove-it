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
import { DashboardServiceParent, Job, ServiceRequestSP } from "../../types";
import  Tab  from "react-bootstrap/Tab";
import Modal from 'react-bootstrap/Modal';
import ErrorMessageContainer from "../../components/ErrorMessageContainer";
import Spinner from "../../components/Spinner";
import  Offcanvas  from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav'
import { ApplyPublicPrompt } from "../../components/ApplyPublicPrompt";
import { SPJobTable } from "../../components/SPJobTable";
/**
 *
 * @returns Void
 */
export function DashboardServiceCluster() {
    const { logout } = useLogout();
    const [error, setError] = useState<string | null>(null);
    const [applicationStatusError, setApplicationStatusError] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dashboardServices, setDashboardServices] = useState<DashboardServiceParent[]>([]);
    const [tickets, setTickets] = useState<ServiceRequestSP[] | null>(null);
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [ticketDetail, setTicketDetail] = useState<ServiceRequestSP | undefined>(undefined);
    const [jobs, setJobs] = useState<Job[]>([]);

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
        async (url: string, method = "GET", body? : string) => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            if (user) {
                headers.append("Authorization", `Bearer ${user.token}`);
            }

            let requestOptions;

            if (method == "GET") {
                requestOptions = {
                    method: method,
                    headers: headers,
                };
            } else if (method == "POST") {
                requestOptions = {
                    method: method,
                    headers: headers,
                    body: body
                }
            }


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

        fetchData(window.config.SERVER_URL + "/active-jobs")
        .then(response => {
            if (response.isSuccess) {
                if (Array.isArray(response.data.jobs)) {
                    setJobs(response.data.jobs);
                }
            } else {
                setError(response.message);
            }
        })
        .catch(error => {
            console.error(error);
            setError('An error occured (see console)');
        })
    }, [user, fetchData]);

    const handleDetailClick = (id: string) => {
        const ticket: ServiceRequestSP | undefined = tickets?.filter(obj => {
            return(obj.id === id);
        })[0];
        console.log("TICKET");
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

    const handleActivateJob = (jobId: string) => {
        setIsLoading(true);

        fetchData(window.config.SERVER_URL + "/activate-job?id=" + jobId, "POST")
        .then(response => {
            setIsLoading(false);
            if (response.isSuccess) {
                alert(response.message);
                location.reload();
            } else {
                alert("Error: " + response.message);
            }
        })
    }

    const handleCompleteJob = (jobId: string) => {
        setIsLoading(true);

        fetchData(window.config.SERVER_URL + "/complete-job?id=" + jobId, "POST")
        .then(response => {
            setIsLoading(false);
            if (response.isSuccess) {
                alert(response.message);
                location.reload();
            } else {
                alert("Error: " + response.message);
            }
        })
    }

    const checkApplicationStatus = () => {

        setIsLoading(true);
        setApplicationStatusError(null);

        fetchData(window.config.SERVER_URL + "/sp-application-status?userId=" + user?.id)
        .then(response => {
            setIsLoading(false);
            
            if (!user?.spDetail) {
                alert("Could not retrieve SpDetail from AuthContext. Please log in again");
                logout();
            }
            else if (response.isSuccess && response.status == "accepted") {
                alert(response.message ?? "Background check approved");
                logout();

            } else if (response.isSuccess && response.status == "rejected") {
                setApplicationStatusError(response.message ?? "Sorry, but your background check was rejected. You are not approved for public provider status");
            } else if (response.isSuccess && response.status == "pending") {
               setApplicationStatusError(response.message ?? "Your application is pending. Please check back later");
            } else {
                setApplicationStatusError(response.message ?? "An error occured while checking your application status")
            }
        })
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
                                tickets.filter(t => t.status === "initiated").map((ticket) => (
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

            {/*Suggestion to apply for public status*/}
            {user?.spDetail && (
                <ApplyPublicPrompt 
                    error={applicationStatusError}
                    isLoading={isLoading}
                    isAppliedForPublic={user.spDetail.isAppliedForPublic}
                    isPublic = {user.spDetail.isPublic}
                    checkStatus={checkApplicationStatus}
                />
            )}

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
            <SPJobTable 
                jobs={jobs}
                activateJob={handleActivateJob}
                completeJob={handleCompleteJob}
                isLoading={isLoading}
            />

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