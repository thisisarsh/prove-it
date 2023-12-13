import { Form, Button} from "react-bootstrap";
import Spinner from "../components/Spinner";
import ErrorMessageContainer from "./ErrorMessageContainer";

import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

import "../styles/pages/inviteTenant.css";
import { useNavigate } from "react-router-dom";
import { Property } from "../types.ts";
import SearchableDropdown from "./DropDownList.tsx";
import { FormGroup} from "./Forms.tsx";

export default function InviteTenantCluster() {
    const { state } = useAuthContext();
    const { user } = state;

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [properties, setProperties] = useState<Property[] | null>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property | undefined>(undefined);

    const [tenantFirstName, setTenantFirstName] = useState("");
    const [tenantLastName, setTenantLastName] = useState("");
    const [tenantEmail, setTenantEmail] = useState("");
    const [tenantPhone, setTenantPhone] = useState("");

    useEffect(() => {
        fetch(import.meta.env.VITE_SERVER + "/properties", {
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
    }, [user?.token]);

    /////
    //EVENT HANDLERS
    /////
    const handlePropertySelect = (property: Property) => {
        setSelectedProperty(property);
    };

    const handleSubmit = () => {
        console.log("Handling submit...");
        setIsLoading(true);
        setError("");
        const inviteUserObject = {
            user: {
                firstName: tenantFirstName,
                lastName: tenantLastName,
                email: tenantEmail,
                phone: tenantPhone,
            },
            roleName: "tenant",
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
            <SearchableDropdown
                items={properties || []}
                onSelect={(property) => handlePropertySelect(property)}
                placeholder={selectedProperty
                    ? `${selectedProperty.name}, ${selectedProperty.streetAddress}`
                    : "Select a property"}
                labelKey={"name"} // Assuming you want to search and display by 'name'
            />
            <div id="invite-form-container">
                <Form id="invite-form">
                    <FormGroup
                        label="First Name"
                        value={tenantFirstName}
                        onChange={(e) => handleInputChange(e, setTenantFirstName)}
                    />
                    <FormGroup
                        label="Last Name"
                        value={tenantLastName}
                        onChange={(e) => handleInputChange(e, setTenantLastName)}
                    />
                    <FormGroup
                        label="Email"
                        type="email"
                        value={tenantEmail}
                        onChange={(e) => handleInputChange(e, setTenantEmail)}
                    />
                    <FormGroup
                        label="Phone"
                        type="phone"
                        value={tenantPhone}
                        onChange={(e) => handleInputChange(e, setTenantPhone)}
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
