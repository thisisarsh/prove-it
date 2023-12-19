import { Form, Button} from "react-bootstrap";
import Spinner from "../components/Spinner.tsx";
import ErrorMessageContainer from "../components/ErrorMessageContainer.tsx";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext.tsx";

import "../styles/pages/inviteUser.css"
import { useNavigate } from "react-router-dom";
import { Property } from "../types.ts";
import SearchableDropdown from "../components/DropDownList.tsx";
import { FormGroup} from "../components/Forms.tsx";

interface InviteUserProps {
    roleName: string
}

export default function InviteUserCluster(props: InviteUserProps) {
    const { state } = useAuthContext();
    const { user } = state;

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [properties, setProperties] = useState<Property[] | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);

    const [invitedFirstName, setInvitedFirstName] = useState("");
    const [invitedLastName, setInvitedLastName] = useState("");
    const [invitedEmail, setInvitedEmail] = useState("");
    const [invitedPhone, setInvitedPhone] = useState("");

    //fetch properties if we are inviting a tenant.
    
    useEffect(() => {
        if (props.roleName == "tenant") {
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
        setError("");
        const inviteUserObject = {
            user: {
                firstName: invitedFirstName,
                lastName: invitedLastName,
                email: invitedEmail,
                phone: invitedPhone
            },
            roleName: props.roleName,
            propertyId: selectedProperty?.id,
            invite: true,
        };
        console.log(inviteUserObject);

        fetch(import.meta.env.VITE_SERVER + "/inviteuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token,
            },
            body: JSON.stringify(inviteUserObject),
        })
            .then((response) => {
                if (!response.ok) {
                    setError("Server response was not ok when inviting user");
                    throw new Error(
                        "Network response was not ok when inviting user",
                    );
                }
                return response.json();
            })
            .then((responseJson) => {
                if (responseJson.isSuccess) {
                    alert("User has been invited sucessfully");
                    navigate("/dashboard");
                } else {
                    setError(responseJson.message);
                }

                setIsLoading(false);
            });
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
            {props.roleName == "tenant" &&
                <SearchableDropdown
                    items={properties || []}
                    onSelect={(property) => handlePropertySelect(property)}
                    placeholder={selectedProperty
                        ? `${selectedProperty.name}, ${selectedProperty.streetAddress}`
                        : "Select a property"}
                    labelKey={"name"} // Assuming you want to search and display by 'name'
                />
            }
            <div id="invite-form-container">
                <Form id="invite-form">
                    <FormGroup
                        label="First Name"
                        value={invitedFirstName}
                        onChange={(e) => handleInputChange(e, setInvitedFirstName)}
                    />
                    <FormGroup
                        label="Last Name"
                        value={invitedLastName}
                        onChange={(e) => handleInputChange(e, setInvitedLastName)}
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
                            type="submit"
                            onClick={() => handleSubmit()}
                        >
                            Send Invite
                        </Button>
                    )}
                </Form>
            </div>
            {error && <ErrorMessageContainer message={error} />}
        </>
    );
}
