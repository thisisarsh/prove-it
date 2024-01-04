/**
 * Dashboard Cluster includes the tables, buttons
 *
 * Sends:
 * Receives:
 */
//import { useEffect } from "react";

import { useLogout } from "../hooks/useLogout.tsx";
import { useState } from "react";
//import { useAuthContext } from "../hooks/useAuthContext.tsx";
import { useNavigate } from "react-router-dom";
//import { Property } from "../types.ts";
//import { ServiceRequest } from "../types.ts";

import "../styles/pages/dashboard.css";
/**
 *
 * @returns Void
 */
export function DashboardServiceCluster() {
    const { logout } = useLogout();
    //const [error, setError] = useState(null);
    //const [isLoading, setIsLoading] = useState(false);
    //const [properties, setProperties] = useState<Property[] | null>(null);
    //const [newRequests, setNewRequests] = useState<ServiceRequest[] | null>([]);
    //const [currentRequests, setCurrentRequests] = useState<ServiceRequest[]>([]);
    //const [completedRequests, setCompletedRequests] = useState<ServiceRequest[]>([]);
    //const { state } = useAuthContext();
    //const { user } = state;
    const navigate = useNavigate();


    // useEffect(() => {
    //     setIsLoading(true);
    //     fetch(import.meta.env.VITE_SERVER + "/service", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: "Bearer " + user?.token,
    //         },
    //     })
    //         .then((response) => {
    //             if (!response.ok) {
    //                 throw new Error("Network response was not ok");
    //             }
    //             //console.log(response.json);
    //             return response.json();
    //         })
    //         .then((data) => {
    //             setIsLoading(false);
    //             setProperties(data);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching data: " + error);
    //         });
    // }, [user, user?.token]);

    //console.log(properties);

    const [isNavPanelVisible, setIsNavPanelVisible] = useState(false);

    // Function to toggle the nav panel
    const toggleNavPanel = () => {
        setIsNavPanelVisible(!isNavPanelVisible);
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1 className="dashboard-title">Dashboard Service Provider</h1>
                <button className="menu-toggle-button" onClick={toggleNavPanel}>
                    ☰
                </button>
            </div>

            {/* Nav Panel */}
            <div className={`nav-panel ${isNavPanelVisible ? 'visible' : ''}`}>
                {/* List your navigation options here */}
                <span className="user-icon">👤</span>
                <a onClick={() => navigate("/services")}>Service Request</a>
                <a onClick={() => navigate("/clients")}>Clients</a>
                <a onClick={() => navigate("/services/complete")}>Completed Request</a>
                <div className="logout-container">
                    <button className="logout-button" onClick={logout}>Log out</button>
                </div>
            </div>
                {/* New Requests Table */}
            <div className="new-request-container">
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

            {/* Current Requests Table */}
            <div className="request-container">
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
            <div className="request-container">
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