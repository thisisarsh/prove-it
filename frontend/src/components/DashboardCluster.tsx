/**
 * Dashboard Cluster includes the tables, buttons
 *
 * Sends:
 * Receives:
 */
import { useEffect } from "react";

import { useLogout } from "../hooks/useLogout";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import { Property } from "../types.ts";

import "../styles/pages/dashboard.css";
/**
 *
 * @returns Void
 */
export function DashboardCluster() {
    const { logout } = useLogout();
    //const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [properties, setProperties] = useState<Property[] | null>(null);

    const { state } = useAuthContext();
    const { user } = state;
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
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
                console.log(response.json);
                return response.json();
            })
            .then((data) => {
                setIsLoading(false);
                setProperties(data);
            })
            .catch((error) => {
                console.error("Error fetching data: " + error);
            });
    }, [user?.token]);

    console.log(properties);

    return (
        <div className="dashboard-container">
            <img
                src="https://hometrumpeter.com/wp-content/uploads/2023/03/logo.svg"
                className="dashboard-logo"
            />

            {/* logout button */}
            <button className="logout-button" onClick={logout}>
                Log out
            </button>
            <h1 className="dashboard-title">Dashboard</h1>

            {/* left side of dashboard for inline-block */}
            <div className="dashboard-left-side">
                {/* Property block */}
                <div className="dashboard-table-container">
                    <h1 className="dashboard-label">Properties</h1>
                    <table className="dashboard-table">
                        <thead className="dashboard-header">
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <td colSpan={2}>Loading Properties...</td>
                            ) : Array.isArray(properties) && properties.length > 0 ? (
                                properties.map((userProperty) => (
                                    <tr>
                                        <td>{userProperty.name}</td>
                                        <td>{userProperty.streetAddress}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={2}>
                                        You haven't added any properties yet.
                                        Start by adding a property!
                                    </td>
                                </tr>
                            )}

                            <tr>
                                <td
                                    className="dashboard-empty-property"
                                    colSpan={2}
                                >
                                    <a
                                        className="dashboard-link"
                                        onClick={() => {
                                            navigate("/addproperty");
                                        }}
                                    >
                                        Add Property...
                                    </a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Service Request block */}
                <div className="dashboard-table-container">
                    <h1 className="dashboard-label">Service Requests</h1>
                    <table className="dashboard-table">
                        <tr className="dashboard-header">
                            <th className="dashboard-header">Service</th>
                            <th>Provider</th>
                            <th>Property</th>
                        </tr>
                        <tr>
                            <td className="dashboard-empty-service" colSpan={3}>
                                <a href="https://youtu.be/dQw4w9WgXcQ?si=xCkLFrt7q1dP8Bk2">
                                    Request a Service
                                </a>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>

            {/* tip block */}
            <div className="tip-table-container">
                <table className="tip-table">
                    <tr className="dashboard-tip-header">
                        <th>Tips</th>
                    </tr>
                    <tr>
                        <td>
                            You dont have any property added.{" "}
                            <a href="https://youtu.be/dQw4w9WgXcQ?si=xCkLFrt7q1dP8Bk2">
                                Start by adding a property
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <a
                                onClick={() => {
                                    navigate("/invite/tenant");
                                }}
                            >
                                Invite a tenant
                            </a>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    );
}
