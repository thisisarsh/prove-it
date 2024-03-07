import { Form, Button } from "react-bootstrap";
import Spinner from "../../components/Spinner";
//import ErrorMessageContainer from "../../components/ErrorMessageContainer";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

import "../../styles/pages/inviteUser.css";
import { Link ,useNavigate } from "react-router-dom";
import { Property } from "../../types";
import SearchableDropdown from "../../components/DropDownList";
import { FormGroup } from "../../components/Forms";
import Modal from 'react-bootstrap/Modal';

interface InviteUserProps {
    roleName: string;
}

export default function InviteUserCluster(props: InviteUserProps) {
    const { state } = useAuthContext();
    const { user } = state;

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    //const [error, setError] = useState("");

    const [properties, setProperties] = useState<Property[] | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<
        Property | undefined
    >(undefined);

    const [invitedFirstName, setInvitedFirstName] = useState("");
    const [invitedLastName, setInvitedLastName] = useState("");
    const [invitedEmail, setInvitedEmail] = useState("");
    const [invitedPhone, setInvitedPhone] = useState("");

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState("");
    const handleShowErrorModal = (errorMessage : string) => {
        setErrorModalMessage(errorMessage);
        setShowErrorModal(true);
    };

    //fetch properties if we are inviting a tenant.

    useEffect(() => {
        if (props.roleName == "tenant") {
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
                    console.log(data);
                    setProperties(data);
                });
        }
    }, [user?.token, props.roleName]);

    //////
    //EVENT HANDLERS
    //////
    const handlePropertySelect = (property: Property) => {
        setSelectedProperty(property);
    };

    const handleSubmit = () => {
        console.log("Handling submit...");
        setIsLoading(true);
        //setError("");
        try{
        if(invitedFirstName == null || invitedLastName == null || invitedEmail == null 
            || invitedPhone == null || selectedProperty == null){
                throw new Error ("Empty fields");
            }
        const inviteUserObject = {
            user: {
                firstName: invitedFirstName,
                lastName: invitedLastName,
                email: invitedEmail,
                phone: invitedPhone,
            },
            roleName: props.roleName,
            propertyId: selectedProperty?.id,
            propertyName: selectedProperty?.streetAddress,
            invite: true,
        };
        //console.log(inviteUserObject);

        fetch(window.config.SERVER_URL + "/send-invite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify(inviteUserObject),
        })
            .then(response => {
                if (!response.ok) {
                    handleShowErrorModal("Server response was not ok when inviting user");
                    return response.json().then(json => Promise.reject(json));
                }
                return response.json();
            })
            .then(responseJson => {
                if (responseJson.isSuccess) {
                    alert("User has been invited successfully");
                    navigate("/dashboard");
                } else {
                    handleShowErrorModal(responseJson.message);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error:', err);
                handleShowErrorModal(err.message || "An error occurred");
                setIsLoading(false);
            });
        } catch (error) {
            handleShowErrorModal("Please fill all fields");
            setIsLoading(false);
        }
    };

    //change handler for all text inputs
    const handleInputChange = <T,>(
        e: React.ChangeEvent<HTMLInputElement>,
        setter: (value: T) => void,
    ) => {
        e.preventDefault();
        setter(e.target.value as unknown as T);
    };

    return (
        <>
            {/*Only display property selector if we are inviting a tenant*/}
            {props.roleName == "tenant" && (
                <SearchableDropdown
                    items={properties || []}
                    onSelect={(property) => handlePropertySelect(property)}
                    placeholder={
                        selectedProperty
                            ? `${selectedProperty.name}, ${selectedProperty.streetAddress}`
                            : "Select a property"
                    }
                    labelKey={"name"} // Assuming you want to search and display by 'name'
                />
            )}
            <div id="invite-form-container">
                <Form id="invite-form">
                    <FormGroup
                        label="First Name"
                        value={invitedFirstName}
                        onChange={(e) =>
                            handleInputChange(e, setInvitedFirstName)
                        }
                    />
                    <FormGroup
                        label="Last Name"
                        value={invitedLastName}
                        onChange={(e) =>
                            handleInputChange(e, setInvitedLastName)
                        }
                    />
                    <FormGroup
                        label="Email"
                        type="email"
                        value={invitedEmail}
                        onChange={(e) => handleInputChange(e, setInvitedEmail)}
                    />
                    <FormGroup
                        label="Phone"
                        type="phone"
                        value={invitedPhone}
                        onChange={(e) => handleInputChange(e, setInvitedPhone)}
                    />

                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <Button
                            id="invite-submit-button"
                            type="button"
                            onClick={() => handleSubmit()}
                        >
                            Send Invite
                        </Button>
                    )}
                    <Link to="/dashboard" className="goBackLink">
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="goBackButton"
                        >
                            <span>Go Back</span>
                        </Button>
                    </Link>
                </Form>
            </div>
            {/*error && <ErrorMessageContainer message={error} />*/}
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{errorModalMessage}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
