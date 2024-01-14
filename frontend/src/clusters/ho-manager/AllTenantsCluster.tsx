import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from "../../hooks/useAuthContext.tsx";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from "../../components/Spinner.tsx";

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

    const [bcModal, setBCModalShow] = useState(false);
    const [AgreementModal, setAgreementModalShow] = useState(false);

    const handleBCModalClose = () => setBCModalShow(false);
    const handleBCModalShow = (tenant: Tenant) => {
        setSelectedTenant(tenant);
        setBCModalShow(true);
    }
    const handleAgreementModalClose = () => setAgreementModalShow(false);
    const handleAgreementModalShow = () => setAgreementModalShow(true);

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
            fetch(`${import.meta.env.VITE_SERVER}/background-check/tenant?${queryParams}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + user?.token,
                },
            })
                // Handle the response and errors as needed
                .finally(() => {
                    setIsLoading(false);
                    setBCModalShow(false);
                });
        }
    };

    useEffect(() => {
        setIsLoading(true);
        fetch(import.meta.env.VITE_SERVER + "/owner-tenants", {
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
                                <Button variant="secondary" size="sm" onClick={handleAgreementModalShow}>Agreement</Button>
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
                <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleBCModalClose}>
                        Close
                    </Button>
                    <Button variant="info" onClick={handleBCInitiation}>
                        Initiate
                    </Button>
                    <Button variant="success" onClick={handleBCModalClose}>
                        Accept
                    </Button>
                    <Button variant="danger" onClick={handleBCModalClose}>
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
                    <Button variant="primary" onClick={handleAgreementModalClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
