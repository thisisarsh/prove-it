/**
 * Dashboard Cluster includes the tables, buttons
 *
 * Sends:
 * Receives:
 */
//import { useEffect } from "react";

import { useLogout } from "../../hooks/useLogout";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
//import { Property } from "../types.ts";
//import { ServiceRequest } from "../types.ts";

import "../../styles/pages/dashboard.css";
import { DashboardServiceParent } from "../../types";
import { Accordion } from "react-bootstrap";
import ErrorMessageContainer from "../../components/ErrorMessageContainer";
import Spinner from "../../components/Spinner";
/**
 *
 * @returns Void
 */
export function DashboardServiceCluster() {
    const { logout } = useLogout();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dashboardServices, setDashboardServices] = useState<DashboardServiceParent[]>([]);

    //const [properties, setProperties] = useState<Property[] | null>(null);
    //const [newRequests, setNewRequests] = useState<ServiceRequest[] | null>([]);
    //const [currentRequests, setCurrentRequests] = useState<ServiceRequest[]>([]);
    //const [completedRequests, setCompletedRequests] = useState<ServiceRequest[]>([]);
    const user = useAuthContext().state.user;
    const navigate = useNavigate();


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
        setIsLoading(true);
        fetchData(import.meta.env.VITE_SERVER + "/user-services?userId=" + user?.id)
        .then(response => {
            setIsLoading(false);
            if (response.isSuccess) {
                setDashboardServices(response.data);
            } else {
                setError(response.message);
            }
        })
        .catch(error => {
            console.error(error);
            setError('An error occured');
        })
    }, [user, fetchData]);

    //console.log(properties);

    const [isNavPanelVisible, setIsNavPanelVisible] = useState(false);

    // Function to toggle the nav panel
    const toggleNavPanel = () => {
        setIsNavPanelVisible(!isNavPanelVisible);
    };

    return (
        <div className="dashboard-container">
            <div className="header mb-5">
                <h1 className="dashboard-title">Dashboard Service Provider</h1>
                <button className="menu-toggle-button" onClick={toggleNavPanel}>
                    ☰
                </button>
            </div>

            {/* Nav Panel */}
            <div className={`nav-panel ${isNavPanelVisible ? 'visible' : ''}`}>
                {/* List your navigation options here */}
                <span className="user-icon">👤</span>
                <a onClick={() => navigate("/add-service")}>Add a service</a>
                <a onClick={() => navigate("/services")}>Service Request</a>
                <a onClick={() => navigate("/clients")}>Clients</a>
                <a onClick={() => navigate("/services/complete")}>Completed Request</a>
                <div className="logout-container">
                    <button className="logout-button" onClick={logout}>Log out</button>
                </div>
            </div>

            {error && <ErrorMessageContainer message={error}/>}
            {isLoading && <Spinner/>}

            {/* New Requests Table */}
            <div className="new-request-container mb-5">
                <h1 className="dashboard-label">New Requests</h1>
                <table className="dashboard-table">
                    <thead className="dashboard-header">
                        <tr>
                            <th>Service</th>
                            <th>Property</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={3}>
                                You have no new service request.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/*My services table*/}
            <div className="request-container mb-5">
                
                <h1 className="dashboard-label">My Services</h1>

                {dashboardServices ? (
                    <Accordion defaultActiveKey={"0"}>
                        {dashboardServices.map((dashboardService, index) => (
                            <Accordion.Item eventKey={index.toString()}>
                                <Accordion.Header>{dashboardService.serviceType}</Accordion.Header>
                                <Accordion.Body>
                                    {dashboardService.childs.map(childService => (
                                        <>
                                            {childService.serviceType}
                                            <br/>
                                        </>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                ) : (
                    <span>
                        You haven't added any services yet! Start by
                        <a className="dashboard-link" onClick={() => {navigate("/add-service")}}> adding a service...</a>
                    </span>
                )}
                
            </div>

            {/* Current Requests Table */}
            <div className="request-container mb-5">
                <h1 className="dashboard-label">Current Requests</h1>
                <table className="dashboard-table">
                <thead className="dashboard-header">    
                        <tr>
                            <th>Service</th>
                            <th>Property</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={3}>
                                You're not working on any service Request!
                                Accept one to get started.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Completed Requests Table */}
            <div className="request-container mb-5">
                <h1 className="dashboard-label">Completed Requests</h1>
                <table className="dashboard-table">
                <thead className="dashboard-header">
                        <tr>
                            <th>Service</th>
                            <th>Property</th>
                            <th>Date Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={3}>
                                You have no completed request!
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
                {/* Nav Panel Overlay */}
                {isNavPanelVisible && (
                <div className="nav-panel-overlay" onClick={toggleNavPanel}></div>
                )}
                {/* Footer */}
                <footer className="dashboard-footer">
                <div className="footer-content">
                    <p>© {new Date().getFullYear()} HomeTrumpeter. All rights reserved.</p>
                    <div className="footer-links">
                        <a onClick={() => navigate("/privacy")}>Privacy Policy</a>
                        <a onClick={() => navigate("/tos")}>Terms of Service</a>
                        <a onClick={() => navigate("/contact")}>Contact Us</a>
                    </div>
                </div>
                </footer>
        </div>
    );
}