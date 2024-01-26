import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { RequestDetails, ServiceProvider} from "../../types";
import { Col, Row } from "react-bootstrap";
import { ServiceProviderCard } from "../../components/ServiceProviderCard";
import { ServiceRequestCard } from "../../components/ServiceRequestCard";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import ErrorMessageContainer from "../../components/ErrorMessageContainer";
import { useSearchParams } from "react-router-dom";

export function RequestQuoteCluster() {

    const user = useAuthContext().state.user;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();


    const PRIVATE_PROVIDERS_LINK = import.meta.env.VITE_SERVER + "/private-providers";
    const REQUEST_DETAILS_LINK = import.meta.env.VITE_SERVER + "/request-details";
    const REQUEST_TICKET_LINK = import.meta.env.VITE_SERVER + "/service-request/ticket";
    const REQUEST_ID = searchParams.get('id')
    

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
    const [requestDetails, setRequestDetails] = useState<RequestDetails | null>(null);

    const fetchData = useCallback(
        async (url: string, method = "GET") => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            if (user) {
                headers.append("Authorization", `Bearer ${user.token}`);
            }
            const requestOptions = {
                method: method,
                headers: headers,
            };

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
        fetchData(PRIVATE_PROVIDERS_LINK)
        .then(response => {
            if (response.isSuccess) {
                setServiceProviders(response.data);
            } else {
                setError("Error: " + response.message);
            }
        });

        fetchData(REQUEST_DETAILS_LINK + "?id=" + REQUEST_ID)
        .then(response => {
            if (response.isSuccess) {
                setRequestDetails(response.data);
            } else {
                setError("Error: " + response.message);
            }
        })
    }, [user, fetchData, PRIVATE_PROVIDERS_LINK, REQUEST_DETAILS_LINK, REQUEST_ID]);

    async function handleSubmitRequest(sp: ServiceProvider) {
        setError(null);
        setIsLoading(true);

        const requestBody = {
            proposals: [
                {
                    serviceProviderId: sp.id,
                    serviceTypeId: requestDetails?.serviceType?.id,
                    timelineId: requestDetails?.timeline?.id,
                }
            ],
            serviceRequestId: requestDetails?.id
        }

        fetch(REQUEST_TICKET_LINK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
           if (!response.ok) {
                setError("Error: Network response was not ok");
           }
           return response.json();
        })
        .then(responseJson => {
            if (responseJson.isSuccess) {
                alert(responseJson.message);
                navigate('/dashboard');
            } else {
                setError(responseJson.message);
            }
        })
        .catch(error => {
            setError("Error posting service request: " + error)
        })


    }

    return (
        <>
            {error && <ErrorMessageContainer message={error}/>}

            <div className="mb-5">
                {requestDetails ? (
                    <ServiceRequestCard requestDetails={requestDetails}/>
                ) : (
                    <>
                        <Spinner/>
                        <p>Loading Service Request...</p>
                    </>
                )}         
            </div>

            <h2>My private service providers</h2>

            {serviceProviders.length > 0 ? (
            <Row className="g-2">
                {serviceProviders.map((serviceProvider) => (
                    <Col className="g-2">
                        <ServiceProviderCard sp={serviceProvider} buttonHandler={handleSubmitRequest} isLoading={isLoading}/>
                    </Col>
                ))}
            </Row>
            ) : (
                <p>You haven't invited any service providers! Start by inviting a service provider...</p>
            )}
        </>
    )
}