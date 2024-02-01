import React, { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { ServiceRequestSP } from "../types";
import { Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import ErrorMessageContainer from "../components/ErrorMessageContainer";
import { FormGroup } from "../components/Forms";
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function SendQuoteCluster( ticketObj: {ticket: ServiceRequestSP} ) {
    const user = useAuthContext().state.user;
    const navigate = useNavigate();
    const ticket = ticketObj.ticket;

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [quotePrice, setQuotePrice] = useState<number>(-1);
    const [quoteType, setQuoteType] = useState<String>('hourly');
    const [estimatedHours, setEstimatedHours] = useState<number>(-1);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

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

    const handleSubmit = (e: React.MouseEvent) => {
        navigate("/dashboard");
    }

    return (
        <>
            {error && <ErrorMessageContainer message={error}/>}
            <FormGroup label="Quote Price" value="0" onChange={(e) => setQuotePrice(parseFloat(e.target.value))}/>
            <p style={{textAlign: "left"}}>Quote Type</p>
            <Form style={{textAlign: "center"}}>
                <Form.Check
                    inline
                    type="radio"
                    id="hourly"
                    label="Hourly"
                    defaultChecked
                />
                <Form.Check
                    inline
                    type="radio"
                    id="fixed"
                    label="Fixed"
                />
            </Form>
            <br></br>
            <FormGroup label="Estimated Hours" value="price" onChange={(e) => setEstimatedHours(parseInt(e.target.value))}/>
            <p>Start Date</p>
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
            <p>End Date</p>
            <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
            <br></br>
            <button className="delete-button" onClick={(e) => handleSubmit(e)}>Submit Quote</button>
        </>
    )
}