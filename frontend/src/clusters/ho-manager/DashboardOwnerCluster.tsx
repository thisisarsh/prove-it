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
import { Property, PropertyDetail, ServiceRequest, TenantinPropertyDetail } from "../../types";
import  Offcanvas  from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav'
import Badge from 'react-bootstrap/Badge';
import Accordion from 'react-bootstrap/Accordion';

import "../../styles/pages/dashboard.css";
import { Button } from "react-bootstrap";
/**
 *
 * @returns Void
 */
export function DashboardOwnerCluster() {
    const { logout } = useLogout();
    //const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [update, setUpdate] = useState<boolean>(false);

    const [properties, setProperties] = useState<Property[] | null>(null);
    const [tickets, setTickets] = useState<ServiceRequest[] | null>(null);
    const [propertyDetail, setPropertyDetail] = useState<PropertyDetail | null>(null);

    const [selectedProperty, setSelectedProperty] = useState<Property | null>(
        null,
    );
    const [tenantinPropertyDetail, setTenantinPropertyDetail] = useState<TenantinPropertyDetail | null>(null);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showDetail, setShowDetail] = useState(false);
    const [showTenant, setShowTenant] = useState(false);
    
    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();

    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
    };

    useEffect(() => {
        if (properties == null){
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
                return response.json();
            })
            .then((data) => {
                setIsLoading(false);
                setProperties(data);
    
                console.log("PROPERTIES");
                console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching properties data: " + error);
            });
        }
    }, [user?.token, properties]); 
    
    useEffect(() => {
        if(tickets == null){
        setIsLoading(true);
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
                return response.json();
            })
            .then((data) => {
                setIsLoading(false);
                setTickets(data);
                console.log("TICKETS");
                console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching tickets data: " + error);
            });
        }
    }, [user?.token, update, tickets]);
    

    //console.log(properties);

    // Function to handle the "Delete" button click
    const handleDeleteClick = (property: Property) => {
        setSelectedProperty(property);
        setShowDeleteConfirmation(true);
    };

    //function to check if a service request has a submitted proposal
    const submittedProposalCount = (serviceRequest : ServiceRequest | undefined) : number => {

        if (serviceRequest != undefined && Array.isArray(serviceRequest.proposals)) {
            let submittedCount = 0;
            for (let i = 0; i<serviceRequest.proposals?.length; i++) {
                if (serviceRequest.proposals[i].status === "submitted") {
                    submittedCount += 1
                }
            }
            return submittedCount;
        }

        return 0;
    }

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
                    // reload page to show update -> call API again
                    setUpdate(true);
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

    // Function to handle the "Tenant" button click
    const handleTenantClick = (property: Property) => {
        
        fetch(window.config.SERVER_URL + "/tenant-detail", {
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
                console.log('Backend response:', responseJson);
                if (responseJson.isSuccess) {
                    setTenantinPropertyDetail(responseJson.tenants);
                    //console.log(tenantinPropertyDetail);
                } else if (!responseJson.isSuccess) {
                    //console.log(responseJson);
                    alert(responseJson.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
        setSelectedProperty(property);
        setShowTenant(true);
    };

    const handleCloseTenant = () => {
        setSelectedProperty(null);
        setShowTenant(false);
    }
    
    // Function to handle the "Reject" button click
    const handleRejectRequest = (reqId: string) => {
        
        fetch(window.config.SERVER_URL + "/service-provider/reject-service?reqId=" + reqId, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify({}),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((responseJson) => {
                console.log('Backend response:', responseJson);
                if (responseJson.isSuccess) {
                    setTenantinPropertyDetail(responseJson.tenants);
                    setUpdate(true);
                } else if (!responseJson.isSuccess) {
                    alert(responseJson.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    };

    return (
    <body>
        <div className="dashboard-container">
            <div className="header">
                <h1 className="dashboard-title">Homeowner Dashboard</h1>
                <button className="menu-toggle-button" onClick={toggleOffcanvas}>
                        ☰
                </button>
            </div>

            {/* Nav Panel */}
            <Offcanvas show={isOffcanvasOpen} onHide={toggleOffcanvas} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title className="navHeader">Homeowner Dashboard</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                <div className="nav-container">
                    <Nav.Link className="nav-link" onClick={() => navigate("/addproperty")}>Add Property</Nav.Link>
                    <Nav.Link className="nav-link" onClick={() => navigate("/invite/tenant")}>Invite Tenant</Nav.Link>
                    <Nav.Link className="nav-link" onClick={() => navigate("/invite/serviceprovider")}>Invite Service Provider</Nav.Link>
                    <Nav.Link className="nav-link" onClick={() => navigate("/ho/tenants")}>Tenants</Nav.Link>
                    <Nav.Link className="nav-link" onClick={() => navigate("/ho/service-providers")}>Service Provider</Nav.Link>
                </div>
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
                                            <button
                                                onClick={() =>
                                                    handleTenantClick(
                                                        userProperty,
                                                    )
                                                }
                                                className="delete-button"
                                            >
                                                Tenant
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
                                    <Button
                                        className="standard-button"
                                        onClick={() => {
                                            navigate("/addproperty");
                                        }}>
                                                Add Property
                                        </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Service Request block */}
                <div className="service-container">
                    <h1 className="dashboard-label">Service Requests</h1>
                    {/* Accordion drop downs */}
                    <Accordion defaultActiveKey="0" style={{paddingTop: '1rem'}}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Active Jobs</Accordion.Header>
                            <Accordion.Body>
                                <table className="dashboard-table">
                                    <thead className="dashboard-header">
                                        <tr>
                                            <th className="dashboard-header">Service</th>
                                            <th>Status</th>
                                            <th>Property</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <td colSpan={2}>Loading Service Requests...</td>
                                        ) : Array.isArray(tickets) &&
                                            tickets.length > 0 ? (
                                            tickets.filter(obj => !['withdrawn', 'rejected', 'completed'].includes(obj.status)).map((userTicket) => (
                                                <tr key={userTicket.id}>
                                                    <td>
                                                        {userTicket.serviceType.serviceType}
                                                    </td>

                                                    <td>
                                                    {userTicket.job?.activityStatus ? (
                                                                <Badge pill bg="primary">
                                                                    {userTicket.job.activityStatus}
                                                                </Badge>
                                                            ) : (
                                                                <Badge pill bg="warning">
                                                                    {userTicket.status}
                                                                </Badge>
                                                            )
                                                    }
                                                    </td>

                                                    <td>
                                                        {userTicket.property.name}
                                                    </td>

                                                    <td>
                                                        {(userTicket.status === "requested" || (userTicket.status === "initiated" && submittedProposalCount(userTicket) <= 0)) && (
                                                            <Button className="standard-button" onClick={() => {navigate(
                                                                "/request-quote?id=" + userTicket.id + "&proId=" + userTicket.property.id + "&serId=" + userTicket.serviceType.id)}}>
                                                                Request quote
                                                            </Button>
                                                        )}

                                                        {userTicket.status === "active" && submittedProposalCount(userTicket) > 0 &&  (
                                                            <Button className="standard-button ms-1"
                                                            onClick={() => {navigate('/proposals?requestId=' + userTicket.id)}}>
                                                                View {submittedProposalCount(userTicket)} Proposal{submittedProposalCount(userTicket) != 1 && "s"}
                                                            </Button>
                                                        )}

                                                        {(userTicket.status != "rejected" && userTicket.status != "withdrawn" && userTicket.status != "completed") && (
                                                            <Button className="standard-button" onClick={() => {handleRejectRequest(userTicket.id)}}>
                                                                Reject
                                                            </Button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4}>
                                                    You don't have any service requests yet.
                                                    Start by requesting a service!
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tr>
                                        <td className="dashboard-empty-service" colSpan={4}>
                                            <Button
                                                className="standard-button"
                                                onClick={() => {
                                                    navigate("/request-service");
                                                }}>
                                                    Request a Service
                                            </Button>
                                        </td>
                                    </tr>
                                </table>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                    <Accordion style={{paddingTop: '1rem'}}>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Completed Jobs</Accordion.Header>
                            <Accordion.Body>
                                <table className="dashboard-table">
                                    <thead className="dashboard-header">
                                        <tr>
                                            <th>Service</th>
                                            <th>Status</th>
                                            <th>Property</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoading ? (
                                            <td colSpan={3}>Loading Service Requests...</td>
                                        ) : Array.isArray(tickets) &&
                                            tickets.length > 0 ? (
                                            tickets.filter(obj => ['withdrawn', 'rejected', 'completed'].includes(obj.status)).map((userTicket) => (
                                                <tr key={userTicket.id}>
                                                    <td>
                                                        {userTicket.serviceType.serviceType}
                                                    </td>

                                                    <td>
                                                        {(userTicket.status === "rejected" &&
                                                            <Badge pill bg="danger">{userTicket.status}</Badge>
                                                        )}
                                                        {(userTicket.status === "withdrawn" &&
                                                            <Badge pill bg="danger">{userTicket.status}</Badge>
                                                        )}
                                                        {(userTicket.status === "completed" &&
                                                            <Badge pill bg="success">{userTicket.status}</Badge>
                                                        )}
                                                    </td>

                                                    <td>
                                                        {userTicket.property.name}
                                                    </td>
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
                                            <Button
                                                className="standard-button"
                                                onClick={() => {
                                                    navigate("/request-service");
                                                }}>
                                                    Request a Service
                                            </Button>
                                        </td>
                                    </tr>
                                </table>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
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

            {/* Delete Confirmation Popup  */}
                <Modal show={showDeleteConfirmation} onHide={handleCancelDelete}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Property?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                        Are you sure to delete the "{selectedProperty?.name}"
                        property?
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <button onClick={handleConfirmDelete} className="delete-button">Yes</button> 
                        <button onClick={handleCancelDelete} className="delete-button">No</button>
                    </Modal.Footer>
                </Modal>
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
                <button onClick={handleCloseDetail} className="delete-button">
                    Close
                </button>
                </Modal.Footer>
            </Modal>

            {/* Show tenant in property Popup */}
            <Modal show={showTenant} onHide={handleCloseTenant} className="DashboardModal">
                <Modal.Header closeButton>
                    <Modal.Title>Tenant at {selectedProperty?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Array.isArray(tenantinPropertyDetail) &&
                    tenantinPropertyDetail != null &&
                    tenantinPropertyDetail.length > 0 ? (
                        <table className="property-detail-table">
                            <tbody>
                                {tenantinPropertyDetail.map((tenant) => (
                                    <tr>
                                        <td>First Name: </td>
                                        <td>{tenant.firstName}</td>
                                    </tr>
                                ))}
                                {tenantinPropertyDetail.map((tenant) => (
                                    <tr>
                                        <td>Last Name: </td>
                                        <td>{tenant.lastName}</td>
                                    </tr>
                                ))}
                                {tenantinPropertyDetail.map((tenant) => (
                                    <tr>
                                        <td>Email: </td>
                                        <td>{tenant.email}</td>
                                    </tr>
                                ))}
                                {tenantinPropertyDetail.map((tenant) => (
                                    <tr>
                                        <td>Phone Number: </td>
                                        <td>{tenant.phone}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <>
                        <p>No tenant assigned to property. You can invite tenant by click the button below</p>
                        <button onClick={() => navigate("/invite/tenant")} className="delete-button">
                            Invite Tenant
                        </button>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                <button onClick={handleCloseTenant} className="delete-button">
                    Close
                </button>
                </Modal.Footer>
            </Modal>
        </div>
    </body>
    );
}

