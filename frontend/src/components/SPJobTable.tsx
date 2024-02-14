import { Button, Col, Row } from "react-bootstrap";
import { Job } from "../types"
import Spinner from "./Spinner";

interface SPJobTableProps {
    jobs: Job[];
    activateJob : (jobId: string) => void;
    completeJob: (jobId: string) => void;
    isLoading: boolean;
}

export function SPJobTable(props: SPJobTableProps) {
    return (
        <div className="request-container mb-5">
                <h1 className="dashboard-label">Current Jobs</h1>

                {props.isLoading && <Spinner/>}

                <table className="dashboard-table">
                    <thead className="dashboard-header">    
                        <tr>
                            <th>Client</th>
                            <th>Service</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.jobs.length > 0 ? (
                            props.jobs.map(job => (
                                <tr>
                                    <td>
                                        {job.initiator.firstName + " " + job.initiator.lastName}
                                    </td>

                                    <td>
                                        {job.serviceType.serviceType}
                                    </td>

                                    <td>
                                        {job.property.streetAddress}
                                    </td>

                                    <td>
                                        
                                        <Row s={1} md={2}>
                                        
                                            <Col>
                                                <Button 
                                                    className="standard-button mb-1" 
                                                    style={{width:"100%"}}
                                                    disabled={props.isLoading}
                                                    onClick={() => {console.log(job)}}
                                                >
                                                    Details
                                                </Button>
                                            </Col>
                                        
                                            <Col>
                                                {job.activityStatus == "pending" &&
                                                    <Button
                                                        className="standard-button mb-1" 
                                                        style={{width:"100%"}} 
                                                        onClick={() => {props.activateJob(job.id)}}
                                                        disabled={props.isLoading}
                                                    >
                                                        Start Job
                                                    </Button>
                                                }

                                                {job.activityStatus == "started" && 
                                                    <Button 
                                                        className="standard-button mb-1"
                                                        style={{width: "100%"}}
                                                        onClick={() => {props.completeJob(job.id)}}
                                                        disabled={props.isLoading}
                                                    >
                                                        Complete Job
                                                    </Button>
                                                }
                                            </Col>
                                        </Row>
                                        
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4}>
                                    You're not working on any service Request!
                                    Accept one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
    )
}