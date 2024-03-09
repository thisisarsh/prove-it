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
import Tab from "react-bootstrap/Tab";
import Modal from "react-bootstrap/Modal";
import ErrorMessageContainer from "../../components/ErrorMessageContainer";
import Spinner from "../../components/Spinner";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import { ApplyPublicPrompt } from "../../components/ApplyPublicPrompt";
import { SPJobTable } from "../../components/SPJobTable";
import Accordion from "react-bootstrap/Accordion";
import Badge from "react-bootstrap/Badge";
import { Button } from "react-bootstrap";

/**
 *
 * @returns Void
 */
export function DashboardServiceCluster() {
    const { logout } = useLogout();
    const [error, setError] = useState<string | null>(null);
    const [applicationStatusError, setApplicationStatusError] = useState<
        string | null
    >(null);
    const [update, setUpdate] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dashboardServices, setDashboardServices] = useState<
        DashboardServiceParent[]
    >([]);
    const [tickets, setTickets] = useState<ServiceRequestSP[] | null>(null);
    const [showTicketDetail, setShowTicketDetail] = useState<boolean>(false);
    const [ticketDetail, setTicketDetail] = useState<
        ServiceRequestSP | undefined
    >(undefined);
    const [activeJobs, setActiveJobs] = useState<Job[]>([]);
    const [completedJobs, setCompletedJobs] = useState<Job[]>([]);

    const user = useAuthContext().state.user;
    const navigate = useNavigate();
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
    };

    const [showMessageModal, setShowMessageModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const handleShowMessageModal = (message: string) => {
        setModalMessage(message);
        setShowMessageModal(true);
    };

    const [showBCMessageModal, setShowBCMessageModal] = useState(false);
    const [BCmodalMessage, setBCModalMessage] = useState("");
    const handleShowBCMessageModal = (message: string) => {
        setBCModalMessage(message);
        setShowBCMessageModal(true);
    };

    const fetchData = useCallback(
        async (url: string, method = "GET", body?: string) => {
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
                    body: body,
                };
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
        fetchData(
            window.config.SERVER_URL + "/user-services?userId=" + user?.id,
        )
            .then((response) => {
                setIsLoading(false);
                if (response.isSuccess) {
                    setDashboardServices(response.data);
                } else {
                    setError(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                setError("An error occured");
            });

        fetchData(window.config.SERVER_URL + "/sp-service-requests")
            .then((response) => {
                setIsLoading(false);
                if (response.isSuccess) {
                    console.log(response.data);

                    let ticket;

                    for (ticket of response.data) {
                        if (!ticket.serviceType) {
                            ticket.serviceType = "NULL";
                        }
                    }
                    console.log("NEW REQUESTS");
                    console.log(response.data);
                    setTickets(response.data);
                } else {
                    setError(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                setError("An error occured");
            });

        fetchData(window.config.SERVER_URL + "/active-jobs")
            .then((response) => {
                if (response.isSuccess) {
                    if (Array.isArray(response.data.jobs)) {
                        console.log("ACTIVE JOBS");
                        console.log(response.data.jobs);
                        setActiveJobs(response.data.jobs);
                    }
                } else {
                    setError(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                setError("An error occured (see console)");
            });

        fetchData(window.config.SERVER_URL + "/completed-jobs")
            .then((response) => {
                if (response.isSuccess) {
                    if (Array.isArray(response.data.jobs)) {
                        console.log("COMPLETED JOBS");
                        console.log(response.data.jobs);
                        setCompletedJobs(response.data.jobs);
                    }
                } else {
                    setError(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                setError("An error occured (see console)");
            });

        setUpdate(false);
    }, [user, fetchData, update]);

    const handleTicketDetailClick = (id: string) => {
        const ticket: ServiceRequestSP | undefined = tickets?.filter((obj) => {
            return obj.id === id;
        })[0];
        console.log("TICKET");
        console.log(ticket);
        setTicketDetail(ticket);
        setShowTicketDetail(true);
    };

    const handleCloseTicketDetail = () => {
        setTicketDetail(undefined);
        setShowTicketDetail(false);
    };

    const handleQuoteClick = (ticket: ServiceRequestSP) => {
        navigate("/send-quote", { state: { ticket: ticket } });
    };

    const handleWithdrawClick = (id: string) => {
        fetchData(
            window.config.SERVER_URL + "/sp-proposal-withdraw?id=" + id,
            "POST",
        )
            .then((response) => {
                if (response.isSuccess) {
                    console.log("SUCCESSFULLY WITHDREW PROPOSAL: " + id);
                    console.log(user);
                    console.log(response);
                    setUpdate(true);
                } else {
                    setError(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
                setError("An error occured");
            });
    };

    const handleActivateJob = (jobId: string) => {
        setIsLoading(true);

        fetchData(
            window.config.SERVER_URL + "/activate-job?id=" + jobId,
            "POST",
        ).then((response) => {
            setIsLoading(false);
            if (response.isSuccess) {
                handleShowMessageModal(response.message);
                setUpdate(true);
            } else {
                handleShowMessageModal("Error: " + response.message);
            }
        });
    };

    const handleCompleteJob = (jobId: string) => {
        setIsLoading(true);

        fetchData(
            window.config.SERVER_URL + "/complete-job?id=" + jobId,
            "POST",
        ).then((response) => {
            setIsLoading(false);
            if (response.isSuccess) {
                handleShowMessageModal(response.message);
                setUpdate(true);
            } else {
                handleShowMessageModal("Error: " + response.message);
            }
        });
    };

    const checkApplicationStatus = () => {
        setIsLoading(true);
        setApplicationStatusError(null);

        fetchData(
            window.config.SERVER_URL +
                "/sp-application-status?userId=" +
                user?.id,
        ).then((response) => {
            setIsLoading(false);

            if (!user?.spDetail) {
                handleShowBCMessageModal(
                    "Could not retrieve SpDetail from AuthContext. Please log in again",
                );
                logout();
            } else if (response.isSuccess && response.status == "accepted") {
                handleShowBCMessageModal(
                    response.message ?? "Background check approved",
                );
                logout();
            } else if (response.isSuccess && response.status == "rejected") {
                setApplicationStatusError(
                    response.message ??
                        "Sorry, but your background check was rejected. You are not approved for public provider status",
                );
            } else if (response.isSuccess && response.status == "pending") {
                setApplicationStatusError(
                    response.message ??
                        "Your application is pending. Please check back later",
                );
            } else {
                setApplicationStatusError(
                    response.message ??
                        "An error occured while checking your application status",
                );
            }
        });
    };

    const BCModalContent = (
        <Modal
            show={showBCMessageModal}
            onHide={() => setShowBCMessageModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{BCmodalMessage}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => {
                        setShowBCMessageModal(false);
                        logout;
                    }}
                >
                    Logout
                </Button>
            </Modal.Footer>
        </Modal>
    );
    const ModalContent = (
        <Modal
            show={showMessageModal}
            onHide={() => setShowMessageModal(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{modalMessage}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setShowMessageModal(false)}
                >
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );

    return (
        <div className="dashboard-container">
            <div className="header mb-5">
                <h1
                    className="dashboard-title"
                    onClick={() => navigate("/dashboard")}
                >
                    Service Provider Dashboard
                </h1>
                <button
                    className="menu-toggle-button"
                    onClick={toggleOffcanvas}
                >
                    ☰
                </button>
            </div>

            {/* Nav Panel */}
            <Offcanvas
                show={isOffcanvasOpen}
                onHide={toggleOffcanvas}
                placement="end"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>
                        Service Provider Dashboard
                    </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="nav-container">
                        <Nav.Link onClick={() => navigate("/add-service")}>
                            Add a service
                        </Nav.Link>
                    </div>
                    <button className="logout-button" onClick={logout}>
                        Log out
                    </button>
                </Offcanvas.Body>
            </Offcanvas>

            {error && <ErrorMessageContainer message={error} />}
            {isLoading && <Spinner />}

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
                            <td colSpan={3}>Loading Properties...</td>
                        ) : Array.isArray(tickets) && tickets.length > 0 ? (
                            tickets
                                .filter((t) => t.status === "initiated")
                                .map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td>
                                            {ticket.serviceType.serviceType}
                                        </td>
                                        <td>{ticket.property.name}</td>
                                        <td>
                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleTicketDetailClick(
                                                        ticket.id,
                                                    )
                                                }
                                            >
                                                Details
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleQuoteClick(ticket)
                                                }
                                            >
                                                Quote
                                            </button>
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

                        {isLoading ? (
                            <td colSpan={3}>Loading Properties...</td>
                        ) : Array.isArray(tickets) && tickets.length > 0 ? (
                            tickets
                                .filter((t) => t.status === "submitted")
                                .map((ticket) => (
                                    <tr key={ticket.id}>
                                        <td>
                                            {ticket.serviceType.serviceType}
                                        </td>
                                        <td>{ticket.property.name}</td>
                                        <td>
                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    handleTicketDetailClick(
                                                        ticket.id,
                                                    )
                                                }
                                            >
                                                Details
                                            </button>
                                            <button
                                                className="delete-button"
                                                style={{ background: "maroon" }}
                                                onClick={() =>
                                                    handleWithdrawClick(
                                                        ticket.id,
                                                    )
                                                }
                                            >
                                                Withdraw
                                            </button>
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
                    isPublic={user.spDetail.isPublic}
                    checkStatus={checkApplicationStatus}
                />
            )}

            {/*My services table*/}
            <div className="request-container mb-5">
                <h1 className="dashboard-label">My Services</h1>

                {dashboardServices ? (
                    <Tab.Container defaultActiveKey="0">
                        <Nav variant="tabs" className="custom-tab-header">
                            {dashboardServices.map(
                                (dashboardService, index) => (
                                    <Nav.Item
                                        key={index.toString()}
                                        className="custom-tab-link"
                                    >
                                        <Nav.Link eventKey={index.toString()}>
                                            {dashboardService.serviceType}
                                        </Nav.Link>
                                    </Nav.Item>
                                ),
                            )}
                            <Nav.Item>
                                <Nav.Link
                                    className="add-service-tab"
                                    onClick={() => {
                                        navigate("/add-service");
                                    }}
                                >
                                    <span style={{ fontWeight: "bold" }}>
                                        Add a service +
                                    </span>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content>
                            {dashboardServices.map(
                                (dashboardService, index) => (
                                    <Tab.Pane
                                        key={index}
                                        eventKey={index.toString()}
                                        className="custom-tab-content"
                                    >
                                        {dashboardService.childs.map(
                                            (childService) => (
                                                <div
                                                    key={
                                                        childService.serviceType
                                                    }
                                                >
                                                    {childService.serviceType}
                                                    <br />
                                                </div>
                                            ),
                                        )}
                                    </Tab.Pane>
                                ),
                            )}
                        </Tab.Content>
                    </Tab.Container>
                ) : (
                    <span>
                        You haven't added any services yet! Start by
                        <a
                            className="dashboard-link"
                            onClick={() => {
                                navigate("/add-service");
                            }}
                        >
                            {" "}
                            adding a service...
                        </a>
                    </span>
                )}
            </div>

            <div className="properties-container">
                <h1 className="dashboard-label">Current Service Requests</h1>
                {/* Current Requests Table */}
                <Accordion defaultActiveKey="0" style={{ paddingTop: "1rem" }}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Active</Accordion.Header>
                        <Accordion.Body>
                            <SPJobTable
                                jobs={activeJobs}
                                activateJob={handleActivateJob}
                                completeJob={handleCompleteJob}
                                isLoading={isLoading}
                            />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                {/* Completed Requests Table */}
                <Accordion style={{ paddingTop: "1rem" }}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Completed</Accordion.Header>
                        <Accordion.Body>
                            <table className="dashboard-table">
                                <thead className="dashboard-header">
                                    <tr>
                                        <th>Service</th>
                                        <th>Property</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <td colSpan={2}>
                                            Loading Service Requests...
                                        </td>
                                    ) : Array.isArray(completedJobs) &&
                                      completedJobs.length > 0 ? (
                                        completedJobs
                                            .filter((obj) =>
                                                [
                                                    "withdrawn",
                                                    "rejected",
                                                    "completed",
                                                ].includes(obj.status),
                                            )
                                            .map((job) => (
                                                <tr>
                                                    <td>
                                                        {
                                                            job.serviceType
                                                                .serviceType
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            job.property
                                                                .streetAddress
                                                        }
                                                    </td>
                                                    <td>
                                                        {job.activityStatus ===
                                                            "completed" && (
                                                            <Badge
                                                                pill
                                                                bg="success"
                                                            >
                                                                {
                                                                    job.activityStatus
                                                                }
                                                            </Badge>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3}>
                                                You have no completed request!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>

            {/* Show more detail about property Popup */}
            <Modal show={showTicketDetail} onHide={handleCloseTicketDetail}>
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
                                        <td>
                                            {
                                                ticketDetail.serviceType
                                                    .serviceType
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Property Name: </td>
                                        <td>{ticketDetail.property.name}</td>
                                    </tr>
                                    <tr>
                                        <td>Address: </td>
                                        <td>
                                            {
                                                ticketDetail.property
                                                    .streetAddress
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Request Date: </td>
                                        <td>{ticketDetail.createdAt}</td>
                                    </tr>
                                    <tr>
                                        <td>Request Timeline: </td>
                                        <td>{ticketDetail.timeline.title}</td>
                                    </tr>
                                    <tr>
                                        <td>Details: </td>
                                        <td>
                                            {ticketDetail.serviceRequest.detail}
                                        </td>
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
                    <button
                        className="delete-button"
                        onClick={handleCloseTicketDetail}
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Footer */}
            <footer className="dashboard-footer">
                <div className="footer-content">
                    <p>
                        © {new Date().getFullYear()} HomeTrumpeter. All rights
                        reserved.
                    </p>
                    <div className="footer-links">
                        <a onClick={() => navigate("/privacy")}>
                            Privacy Policy
                        </a>
                        <a onClick={() => navigate("/tos")}>Terms of Service</a>
                        <a onClick={() => navigate("/contact")}>Contact Us</a>
                    </div>
                </div>
            </footer>
            {ModalContent}
            {BCModalContent}
        </div>
    );
}
