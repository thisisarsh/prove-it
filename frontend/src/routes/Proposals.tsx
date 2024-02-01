import htLogo from "../assets/ht-logo.svg";
import { ProposalsCluster } from "../clusters/ho-manager/ProposalsCluster";

export function Proposals() {
    return (
        <div className="login-container">
            <img
                src={htLogo}
                className="main-logo"
            />

            <h1>
                Service Proposals
            </h1>

            <p>
                Review, Reject, or approve proposals for the following service request:
            </p>

            <ProposalsCluster/>
        </div>
    );
}