import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from "../../components/Spinner";
import  Offcanvas  from 'react-bootstrap/Offcanvas';
import Nav from 'react-bootstrap/Nav'

interface Tenant {
    id: string;
    firstName: string;
    lastName: string;
    email: string
}

interface TenantPropertyProps {
    property: string;
    tenant: Tenant;
}
export function AllTenantsCluster() {
    const [isLoading, setIsLoading] = useState(false);
    const [tenantsData, setTenantsData] = useState<TenantPropertyProps[]>([]);
    const { state } = useAuthContext();
    const { user } = state;
    const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
    const toggleOffcanvas = () => {
        setIsOffcanvasOpen(!isOffcanvasOpen);
    };
    const { logout } = useLogout();

    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

    const [bcModal, setBCModalShow] = useState(false);
    const [AgreementModal, setAgreementModalShow] = useState(false);

    const handleBCModalClose = () => setBCModalShow(false);
    const handleBCModalShow = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setBCModalShow(true);
    }
    const handleAgreementModalClose = () => setAgreementModalShow(false);
    const handleAgreementModalShow = (tenant: Tenant) =>{
        setSelectedTenant(tenant);
        setAgreementModalShow(true);
    }

    const navigate = useNavigate();

    const handleBCInitiation = () => {

        if (selectedTenant) {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                userId: selectedTenant.id,
                firstName: selectedTenant.firstName,
                lastName: selectedTenant.lastName,
                email: selectedTenant.email
            }).toString();

            setIsLoading(true);
            fetch(`${window.config.SERVER_URL}/background-check/tenant?${queryParams}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user?.token,
                },
            })
                .finally(() => {
                    setIsLoading(false);
                    setBCModalShow(false);
                });
        }
    };

    const handleBCApprove = () => {

        if (selectedTenant) {
            setIsLoading(true);

            const queryParams = new URLSearchParams({
                userId: selectedTenant.id
            }).toString();

            setIsLoading(true);
            fetch(`${window.config.SERVER_URL}/background-check/tenant/approve?${queryParams}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user?.token,
                },
            })
                .finally(() => {
                    setIsLoading(false);
                    setBCModalShow(false);
                });
        }
    };

    const handleSendAgreement = () => {
        if (selectedTenant) {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                userId: selectedTenant.id
            }).toString();
            fetch(`${window.config.SERVER_URL}/agreement/initiate?${queryParams}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
            })
                .finally(() => {
                    setIsLoading(false);
                    setAgreementModalShow(false);
                });
        }
    }

    const handleSubmitAgreement = () => {
        if (selectedTenant) {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                userId: selectedTenant.id
            }).toString();
            fetch(`${window.config.SERVER_URL}/agreement/submit?${queryParams}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
            })
                .finally(() => {
                    setIsLoading(false);
                    setAgreementModalShow(false);
                });
        }
    }

    const handleApproveAgreement = () => {
        if (selectedTenant) {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                userId: selectedTenant.id
            }).toString();

            fetch(`${window.config.SERVER_URL}/agreement/approve?${queryParams}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.token}`,
                },
            })
                .finally(() => {
                    setIsLoading(false);
                    setAgreementModalShow(false);
                });
        }
    }

    const handleBCReject = () => {
        // WIP : Add functionality for rejection
    }

    useEffect(() => {
        setIsLoading(true);
        fetch(window.config.SERVER_URL + "/owner-tenants", {
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
                const formattedData:TenantPropertyProps[] = [];
                for (const propertyName in data) {
                    data[propertyName].forEach((tenant: Tenant) => {
                        formattedData.push({ property: propertyName, tenant });
                    });
                }
                setTenantsData(formattedData);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    }, [user?.token]);

    return (
        <body>
            <div className="dashboard-container">
            <div className="header">
                <h1 className="dashboard-title">Dashboard Homeowner</h1>
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
                        <Nav.Link onClick={() => navigate("/addproperty")}>Add Property</Nav.Link>
                        </li>
                        <li>
                        <Nav.Link onClick={() => navigate("/invite/tenant")}>Invite Tenant</Nav.Link>
                        </li>
                        <li>
                        <Nav.Link onClick={() => navigate("/invite/serviceprovider")}>Invite Service Provider</Nav.Link>
                        </li>
                        <li>
                        <Nav.Link onClick={() => navigate("/property")}>Property</Nav.Link>
                        </li>
                        <li>
                        <Nav.Link onClick={() => navigate("/ho/tenants")}>Tenants</Nav.Link>
                        </li>
                        <li>
                        <Nav.Link onClick={() => navigate("/ho/service-providers")}>Service Provider</Nav.Link>
                        </li>
                    </ul>
                    </Nav>
                    <button className="logout-button" onClick={logout}>Log out</button>
                </Offcanvas.Body>
            </Offcanvas>
            </div>
            <div className="properties-container">
                    <h1 className="dashboard-label">Service Providers</h1>
                    {isLoading ? <Spinner /> : (
                    <table className="dashboard-table">
                        <thead className="dashboard-header">
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Property</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {tenantsData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.tenant.firstName}</td>
                            <td>{item.tenant.lastName}</td>
                            <td>{item.tenant.email}</td>
                            <td>{item.property}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => handleBCModalShow(item.tenant)}>Background Check</Button>
                                {' '}
                                <Button variant="secondary" size="sm" onClick={() => handleAgreementModalShow(item.tenant)}>Agreement</Button>
                            </td>
                        </tr>
                    ))}
                        <tr>
                            <td className="dashboard-empty-property" colSpan={5}>
                                    <button className="add-property-button" onClick={() => {
                                        navigate("/invite/tenant"); }}>
                                            Invite a tenent
                                    </button>
                            </td>
                        </tr>
                    </tbody>
                    </table>
                    )}
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
        <div>
            <Modal show={bcModal} onHide={handleBCModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Background Check</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleBCModalClose}>
                        Close
                    </Button>
                    <Button variant="info" onClick={handleBCInitiation}>
                        Initiate
                    </Button>
                    <Button variant="success" onClick={handleBCApprove}>
                        Accept
                    </Button>
                    <Button variant="danger" onClick={handleBCReject}>
                        Reject
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={AgreementModal} onHide={handleAgreementModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agreement</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAgreementModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSendAgreement}>
                        Send
                    </Button>
                    <Button variant="info" onClick={handleSubmitAgreement}>
                        Submit
                    </Button>
                    <Button variant="success" onClick={handleApproveAgreement}>
                        Approve
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    </body>
    );
}
