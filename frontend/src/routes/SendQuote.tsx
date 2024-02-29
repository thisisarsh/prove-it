import htLogo from "../assets/ht-logo.svg";
import { SendQuoteCluster } from "../clusters/service-provider/SendQuoteCluster";
import { ServiceRequestSP } from "../types";

import { useLocation } from "react-router-dom";

export function SendQuote() {
    const {state} = useLocation();
    const { ticket }: { ticket: ServiceRequestSP } = state; // Read values passed on state
    console.log(ticket);

    return (
        <div className="login-container">
            <img
                src={htLogo}
                className="main-logo"
            />

            <h1>{ticket.serviceType.serviceType}</h1>
            <p>{ticket.property.name}</p>
            <p>{ticket.property.streetAddress}</p>
            <p>{ticket.initiator.firstName} {ticket.initiator.lastName}</p>
            <p>{ticket.serviceRequest.detail}</p>
            <br></br>

            <SendQuoteCluster ticket={ticket} />
        </div>
    )
}