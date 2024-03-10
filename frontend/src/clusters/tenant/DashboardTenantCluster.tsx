import { useEffect, useCallback } from "react";

import { useLogout } from "../../hooks/useLogout";
import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { TenantProperty, ServiceRequest, ContactInfo } from "../../types";
import Offcanvas from "react-bootstrap/Offcanvas";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Badge from "react-bootstrap/Badge";
import Accordion from "react-bootstrap/Accordion";

import Homie from "../../components/Homie";

import "../../styles/pages/dashboard.css";
import { Button } from "react-bootstrap";
import { OwnerContactModal } from "../../components/OwnerContactModal";

/**
 *
 * @returns Void
 */
export function DashboardTenantCluster() {
    const { logout } = useLogout();
    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState<TenantProperty[] | null>(null);
    const [tickets, setTickets] = useState<ServiceRequest[] | null>(null);
    const [showTicketDetail, setShowTicketDetail] = useState<boolean>(false);
    const [ticketDetail, setTicketDetail] = useState<
        ServiceRequest | undefined
    >(undefined);
    const [update, setUpdate] = useState<boolean>(false);
    const [showOwnerContact, setShowOwnerContact] = useState<boolean>(false);
    const [ownerContact, setOwnerContact] = useState<ContactInfo | undefined>(
        undefined,
    );

    const [propertyID, setPropertyID] = useState<string>("");

    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
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
                throw error;
            }
        },
        [user],
    );

    useEffect(() => {
        setIsLoading(true);
        if (user) {
            fetch(
                window.config.SERVER_URL +
                    "/properties-tenant" +
                    "?tenantId=" +
                    user.id,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + user?.token,
                    },
                },
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    setIsLoading(false);
                    setProperties(data);
                    setOwnerContact(data[0].ownerContact);
                    setPropertyID(data[0].id);
                })
                .catch((error) => {
                    console.error("Error fetching data: " + error);
                });

            fetch(window.config.SERVER_URL + "/tenant/service-requests", {
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
                    setTickets(data.data.serviceRequests);
                    console.log("TENANT TICKETS");
                    console.log(data);
                })
                .catch((error) => {
                    console.error("Error fetching data: " + error);
                });
            setUpdate(false);
        }
    }, [user, user?.token, update]);

    const handleTicketDetailClick = (id: string) => {
        const ticket: ServiceRequest | undefined = tickets?.filter((obj) => {
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

    const handleWithdrawClick = (id: string) => {
        fetchData(
            window.config.SERVER_URL + "/service-request-withdraw?id=" + id,
            "POST",
        )
            .then((response) => {
                if (response.isSuccess) {
                    console.log("SUCCESSFULLY WITHDREW SERVICE REQUEST: " + id);
                    console.log(user);
                    console.log(response);
                    setUpdate(true);
                } else {
                    console.error(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    console.log(ownerContact);

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1
                    className="dashboard-title"
                    onClick={() => navigate("/dashboard")}
                >
                    Tenant Dashboard
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
                    <Offcanvas.Title>Tenant Dashboard</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <div className="nav-container">
                        <Nav.Link
                            onClick={() => navigate("/tenant/see-agreement")}
                        >
                            See Agreement
                        </Nav.Link>
                    </div>
                    <button className="logout-button" onClick={logout}>
                        Log out
                    </button>
                </Offcanvas.Body>
            </Offcanvas>
            {/* Property block */}
            <div className="properties-container">
                <h1 className="dashboard-label">Property</h1>
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
                                    <td>
                                        <div className="between-flex">
                                            {userProperty.owner}

                                            <Button
                                                className="standard-button"
                                                onClick={() => {
                                                    setShowOwnerContact(true);
                                                }}
                                            >
                                                Contact Information
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2}>
                                    You haven't added any properties yet. Start
                                    by adding a property!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {ownerContact && (
                <OwnerContactModal
                    show={showOwnerContact}
                    ownerContact={ownerContact}
                    handleClose={() => {
                        setShowOwnerContact(false);
                    }}
                />
            )}

            {/* Service Request block */}
            <div className="service-container">
                <h1 className="dashboard-label">Service Requests</h1>

                <Accordion defaultActiveKey="0" style={{ paddingTop: "1rem" }}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Active</Accordion.Header>
                        <Accordion.Body>
                            <table className="dashboard-table">
                                <thead className="dashboard-header">
                                    <tr>
                                        <th className="dashboard-header">
                                            Service
                                        </th>
                                        <th>Request Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <td colSpan={4}>
                                            Loading Service Requests...
                                        </td>
                                    ) : Array.isArray(tickets) &&
                                      tickets.length > 0 ? (
                                        tickets
                                            .filter(
                                                (t) =>
                                                    ![
                                                        "withdrawn",
                                                        "rejected",
                                                        "completed",
                                                    ].includes(t.status),
                                            )
                                            .map((userTicket) => (
                                                <tr>
                                                    <td>
                                                        {
                                                            userTicket
                                                                .serviceType
                                                                .serviceType
                                                        }
                                                    </td>
                                                    <td>
                                                        {userTicket.createdAt.substring(
                                                            0,
                                                            10,
                                                        )}
                                                    </td>
                                                    <td>
                                                        {userTicket.job
                                                            ?.activityStatus ? (
                                                            <Badge
                                                                pill
                                                                bg="primary"
                                                            >
                                                                {
                                                                    userTicket
                                                                        .job
                                                                        .activityStatus
                                                                }
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                pill
                                                                bg="warning"
                                                            >
                                                                {
                                                                    userTicket.status
                                                                }
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleTicketDetailClick(
                                                                    userTicket.id,
                                                                )
                                                            }
                                                        >
                                                            Details
                                                        </button>
                                                        {userTicket.status ===
                                                            "requested" && (
                                                            <button
                                                                className="delete-button"
                                                                style={{
                                                                    background:
                                                                        "maroon",
                                                                }}
                                                                onClick={() =>
                                                                    handleWithdrawClick(
                                                                        userTicket.id,
                                                                    )
                                                                }
                                                            >
                                                                Withdraw
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4}>
                                                You don't have any service
                                                requests yet. Start by
                                                requesting a service!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                <tr>
                                    <td
                                        className="dashboard-empty-service"
                                        colSpan={4}
                                    >
                                        <button
                                            className="request-service-button"
                                            onClick={() => {
                                                navigate("/request-service");
                                            }}
                                        >
                                            {" "}
                                            Request a Service
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

                <Accordion style={{ paddingTop: "1rem" }}>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Completed</Accordion.Header>
                        <Accordion.Body>
                            <table className="dashboard-table">
                                <thead className="dashboard-header">
                                    <tr>
                                        <th className="dashboard-header">
                                            Service
                                        </th>
                                        <th>Property</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        <td colSpan={4}>
                                            Loading Service Requests...
                                        </td>
                                    ) : Array.isArray(tickets) &&
                                      tickets.length > 0 ? (
                                        tickets
                                            .filter((t) =>
                                                [
                                                    "withdrawn",
                                                    "rejected",
                                                    "completed",
                                                ].includes(t.status),
                                            )
                                            .map((userTicket) => (
                                                <tr>
                                                    <td>
                                                        {
                                                            userTicket
                                                                .serviceType
                                                                .serviceType
                                                        }
                                                    </td>
                                                    <td>
                                                        {
                                                            userTicket.property
                                                                .streetAddress
                                                        }
                                                    </td>
                                                    <td>
                                                        {userTicket.status ==
                                                        "completed" ? (
                                                            <Badge
                                                                pill
                                                                bg="success"
                                                            >
                                                                {
                                                                    userTicket.status
                                                                }
                                                            </Badge>
                                                        ) : (
                                                            <Badge
                                                                pill
                                                                bg="danger"
                                                            >
                                                                {
                                                                    userTicket.status
                                                                }
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="delete-button"
                                                            onClick={() =>
                                                                handleTicketDetailClick(
                                                                    userTicket.id,
                                                                )
                                                            }
                                                        >
                                                            Details
                                                        </button>
                                                        {userTicket.status ===
                                                            "requested" && (
                                                            <button
                                                                className="delete-button"
                                                                style={{
                                                                    background:
                                                                        "maroon",
                                                                }}
                                                                onClick={() =>
                                                                    handleWithdrawClick(
                                                                        userTicket.id,
                                                                    )
                                                                }
                                                            >
                                                                Withdraw
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4}>
                                                You don't have any service
                                                requests yet. Start by
                                                requesting a service!
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
                    <Modal.Title>Service Request Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="property-detail-table">
                        <tbody>
                            {ticketDetail != null ? (
                                <>
                                    {ticketDetail.activityStatus && (
                                        <tr>
                                            <td>Activity Status:</td>
                                            <td>
                                                {ticketDetail.activityStatus}
                                            </td>
                                        </tr>
                                    )}
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
            <Homie propertyId={propertyID} />
        </div>
    );
}
