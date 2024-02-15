import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from "../../hooks/useAuthContext";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from "../../components/Spinner";
import { TenantBGResult } from "../../types";

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

    const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
    const [tenantBGResult, setTenantBGResult] = useState<TenantBGResult | null>(null);

    const [bcModal, setBCModalShow] = useState(false);
    const [AgreementModal, setAgreementModalShow] = useState(false);

    const handleBCModalClose = () => setBCModalShow(false);
    const handleBCModalShow = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        fetch(window.config.SERVER_URL + "/background-check/tenant-application", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify({ id: tenant.id }),
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
                if (responseJson != null) {
                    setTenantBGResult(responseJson);
                } else if (responseJson == null) {
                    //console.log(responseJson);
                    alert(responseJson.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
        
        setBCModalShow(true);

    }
    const handleAgreementModalClose = () => setAgreementModalShow(false);
    const handleAgreementModalShow = (tenant: Tenant) =>{
        setSelectedTenant(tenant);
        setAgreementModalShow(true);
    }

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

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
        if (selectedTenant) {
            setIsLoading(true);
            const queryParams = new URLSearchParams({
                userId: selectedTenant.id
            }).toString();

            fetch(`${window.config.SERVER_URL}/background-check/tenant/reject?${queryParams}`, {
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

    const handleBCDownload = (tenantBGResult : TenantBGResult) => {
        setIsLoading(true);
        fetch(window.config.SERVER_URL + "/background-check/tenant-application-download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify({ applicantId: tenantBGResult.id, id: tenantBGResult.tenantId }),
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
                    window.open(responseJson.reportUrl, "_blank");
                } else if (!responseJson.isSuccess) {
                    //console.log(responseJson);
                    alert(responseJson.message);
                }
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
        setIsLoading(false);
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
        <div>
            <Button variant="secondary" onClick={handleGoBack}>{'< Go Back'}</Button>
            {isLoading ? <Spinner /> : (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Tenant</th>
                        <th>Property</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tenantsData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.tenant.firstName} {item.tenant.lastName}</td>
                            <td>{item.property}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => handleBCModalShow(item.tenant)}>Background Check</Button>
                                {' '}
                                <Button variant="secondary" size="sm" onClick={() => handleAgreementModalShow(item.tenant)}>Agreement</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            )}
            <Modal show={bcModal} onHide={handleBCModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Background Check</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {tenantBGResult != null && Array.isArray(tenantBGResult.checksResult) ? (
                        tenantBGResult.checksResult.length > 1 ? (
                        <>
                        <table className="property-detail-table">
                            <thead className="dashboard-header">
                                <tr>
                                    <th>Check</th>
                                    <th>Status</th>
                                    <th>Result</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tenantBGResult.checksResult.map((result) => (
                                    <tr>
                                        <td>{result.checkName}</td>
                                        <td>{result.result}</td>
                                        <td>{result.statusLabel}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Button variant="info" onClick={() => handleBCDownload(tenantBGResult)}>
                            Download Result
                        </Button>
                        <Button variant="success" onClick={handleBCApprove}>
                            Accept
                        </Button>
                        <Button variant="danger" onClick={handleBCReject}>
                            Reject
                        </Button>
                        </>
                        ) : (
                            <h1>Background Check initiated</h1>
                        )
                    ) : (
                        <>
                        <p>Tenant have no info on background check, press the button below to initiate the background check</p>
                        <Button variant="info" onClick={handleBCInitiation}>
                            Initiate
                        </Button>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleBCModalClose}>
                        Close
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
    );
}
