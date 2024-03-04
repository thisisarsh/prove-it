import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { RequestDetails, ServiceProvider } from "../../types";
import { Col, Row } from "react-bootstrap";
import { ServiceProviderCard } from "../../components/ServiceProviderCard";
import { ServiceRequestCard } from "../../components/ServiceRequestCard";
import Spinner from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import ErrorMessageContainer from "../../components/ErrorMessageContainer";
import { useSearchParams } from "react-router-dom";
import { RequestQuoteTable } from "../../components/RequestQuoteTable";
import { SRDetailTable } from "../../components/SRDetailTable";


export function RequestQuoteCluster() {

    const user = useAuthContext().state.user;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();


    const PRIVATE_PROVIDERS_LINK = window.config.SERVER_URL + "/find-sp";
    const REQUEST_DETAILS_LINK = window.config.SERVER_URL + "/request-details";
    const REQUEST_TICKET_LINK = window.config.SERVER_URL + "/service-request/ticket";
    const REQUEST_ID = searchParams.get('id');
    const REQUEST_PROPERTY_ID = searchParams.get('proId');
    const REQUEST_SERVICE_ID = searchParams.get('serId');


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
        if(serviceProviders.length == 0){
        fetch(PRIVATE_PROVIDERS_LINK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + user?.token
            },
            body: JSON.stringify({childId: REQUEST_SERVICE_ID, propertyId: REQUEST_PROPERTY_ID})
        })
        .then(response => {
            if (!response.ok) {
                 setError("Error: Network response was not ok");
            }
            return response.json();
         })
        .then(responseJson => {
            if (responseJson.isSuccess) {
                setServiceProviders(responseJson.data);
            } else {
                setError("Error: " + responseJson.message);
            }
        });

        fetchData(REQUEST_DETAILS_LINK + "?id=" + REQUEST_ID)
        .then(response => {
            if(response.isSuccess) {
                setRequestDetails(response.data);
            } else {
                setError("Error: " + response.message);
            }
        })
    }}, [user, fetchData, PRIVATE_PROVIDERS_LINK, REQUEST_DETAILS_LINK, REQUEST_ID, REQUEST_SERVICE_ID, REQUEST_PROPERTY_ID, serviceProviders]);

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
                console.log(responseJson);
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

            {/* <div className="mb-5">
                {requestDetails ? (
                    <ServiceRequestCard requestDetails={requestDetails}/>
                ) : (
                    <>
                        <Spinner/>
                        <p>Loading Service Request...</p>
                    </>
                )}         
            </div> */}

            <div className="mb-5">
                {requestDetails ? (
                    <SRDetailTable requestDetails={requestDetails}/>
                ) : (
                    <>
                        <Spinner/>
                        <p>Loading Service Request...</p>
                    </>
                )}
            </div>
            
            {isLoading ? (
                <div className="mb-5">
                    <Spinner/>
                    <p>Submitting request...</p>
                </div>
            ) : (
                <>
                    <h2>Available service providers</h2>
                    
                    <div className="mb-5">
                        <RequestQuoteTable
                            serviceProviders={serviceProviders}
                            handleSubmitRequest={handleSubmitRequest}
                            isLoading={isLoading}
                        />
                    </div>
                </>                
            )}

            {!isLoading && serviceProviders.length == 0 && (
                <p>You don't have any private service providers! Start by inviting a service provider...</p>
            )}
        </>
    )
}