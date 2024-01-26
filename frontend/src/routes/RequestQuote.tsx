import htLogo from "../assets/ht-logo.svg";
import { RequestQuoteCluster } from "../clusters/ho-manager/RequestQuoteCluster";

export function RequestQuote() {
    return (
        <div className="login-container">
            <img
                src={htLogo}
                className="main-logo"
            />

            <h1>Request a Quote</h1>

            <p>Request a quote from a public or private service provider for the following service request:</p>

            <RequestQuoteCluster/>
        </div>
    )
}