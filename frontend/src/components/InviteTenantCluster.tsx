import {Form, Button, Dropdown} from "react-bootstrap";
import Spinner from "../components/Spinner";
import ErrorMessageContainer from "./ErrorMessageContainer";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

import "../styles/pages/inviteTenant.css"
import { useNavigate } from "react-router-dom";

export default function InviteTenantCluster() {
    const { state } = useAuthContext();
    const  { user } = state;

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(undefined);

    const [tenantFirstName, setTenantFirstName] = useState("");
    const [tenantLastName, setTenantLastName] = useState("");
    const [tenantEmail, setTenantEmail] = useState("");
    const [tenantPhone, setTenantPhone] = useState("");

    useEffect(() => {
        fetch(import.meta.env.VITE_SERVER + "/properties", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user?.token,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }).then(data => {
            console.log(data);
            setProperties(data);
        })
    }, []);

    /////
    //EVENT HANDLERS
    /////
    const handlePropertySelect = (property) => {
        setSelectedProperty(property);
    }

    const handleSubmit = () => {
        console.log('Handling submit...');
        setIsLoading(true);
        setError(null);
        const inviteUserObject = {
            user: {
                firstName: tenantFirstName,
                lastName: tenantLastName,
                email: tenantEmail,
                phone: tenantPhone
            },
            roleName: "tenant",
            propertyId: selectedProperty?.id,
            invite: true
        }
        console.log(inviteUserObject);

        fetch(import.meta.env.VITE_SERVER + "/inviteuser", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user?.token,
            },
            body: JSON.stringify(inviteUserObject)
        }).then(response => {
            if (!response.ok) {
                setError('Server response was not ok when inviting user');
                throw new Error('Network response was not ok when inviting user');
            }
            return response.json();
        }).then(responseJson => {
            if (responseJson.isSuccess) {
                alert('User has been invited sucessfully');
                navigate('/dashboard');
            } else {
                setError(responseJson.message);
            }

            setIsLoading(false);
        })
    }

    //change handler for all text inputs
    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>, setter : (value: any) => void) => {
        e.preventDefault();
        setter(e.target.value);
    }

    return (
        <>
            <Dropdown id="property-dropdown">
                        <Dropdown.Toggle variant="secondary" id="property-dropdown-toggle">
                            {selectedProperty ? (selectedProperty.name + ', ' + selectedProperty.streetAddress) : ("Select a property")}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {properties.map(property => (
                                <Dropdown.Item onClick={() => {handlePropertySelect(property)}}>
                                    {property.name + ', ' + property.streetAddress}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>
            <div id="invite-form-container">
                

                <Form id="invite-form">

                    <Form.Group controlId="tenantFirstName" className="invite-form-group">
                        <Form.Label>First Name:</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="First Name"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleInputChange(e, setTenantFirstName)}}
                        />
                    </Form.Group>

                    <Form.Group controlId="tenantLastName" className="invite-form-group">
                                <Form.Label>Last Name:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Last Name"
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleInputChange(e, setTenantLastName)}}
                                />
                    </Form.Group>

                    <Form.Group controlId="tenantEmail" className="invite-form-group">
                        <Form.Label>Email:</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleInputChange(e, setTenantEmail)}}
                        />
                    </Form.Group>

                    <Form.Group controlId="tenantPhone" className="invite-form-group">
                        <Form.Label>Phone:</Form.Label>
                        <Form.Control
                            type="phone"
                            placeholder="Phone"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {handleInputChange(e, setTenantPhone)}}
                        />
                    </Form.Group>
                    
                    {isLoading ? (
                        <Spinner/>
                    ) : (
                        <Button id="invite-submit-button" onClick={() => handleSubmit()}>
                            Send Invite
                        </Button>
                    )}
                    
                </Form>
            </div>

            {error && <ErrorMessageContainer message="error"/>}
        </>
    )
}