import { useCallback, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { ServiceRequestSP } from "../types";
import { useNavigate } from "react-router-dom";

import ErrorMessageContainer from "../components/ErrorMessageContainer";
import { FormGroup } from "../components/Forms";
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const INVITED_SIGNUP_LINK = window.config.SERVER_URL + "/send-proposal";

export type Proposal = {
    id: string;
    detail: string;
    quotePrice: string;
    quoteType: string;
    estimatedHours: string;
    startDate: string;
    endDate: string;
}

export function SendQuoteCluster( ticketObj: {ticket: ServiceRequestSP} ) {
    const user = useAuthContext().state.user;
    const navigate = useNavigate();
    const ticket = ticketObj.ticket;

    const [error, setError] = useState<string | null>(null);

    const [quotePrice, setQuotePrice] = useState<number>(null || 0);
    const [quoteType, setQuoteType] = useState<string>('hourly');
    const [estimatedHours, setEstimatedHours] = useState<number>(0);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    const postData = useCallback(
        async (url: string, body: Proposal) => {
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            if (user) {
                headers.append("Authorization", `Bearer ${user.token}`);
            }
            const requestOptions = {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
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

    // const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {}

    const handleSubmit = () => {
        const body: Proposal = {
            id: ticket.id.toString(),
            detail: ticket.serviceRequest.detail.toString(),
            quotePrice: quotePrice.toString(),
            quoteType: quoteType.toString(),
            estimatedHours: estimatedHours.toString(),
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
        }
        console.log(body);

        postData(INVITED_SIGNUP_LINK, body)
        .then((response) => {
            if (response.isSuccess) {
                console.log('SUCCESS POST SP QUOTE');
                console.log(response.data);
                navigate("/dashboard");
            } else {
                setError(response.message);
            }
        });
    }

    return (
        <>
            {error && <ErrorMessageContainer message={error}/>}
            <FormGroup label="Quote Price" value={quotePrice.toString()} onChange={(e) => setQuotePrice(parseFloat(e.target.value))}/>
            {/*<FormGroup label="Quote Price" value={quotePrice.toString()} onChange={(e) => handlePriceChange(e)}/>*/}
            <p style={{textAlign: "left"}}>Quote Type</p>
            <Form style={{textAlign: "center"}}>
                <Form.Check
                    inline
                    type="radio"
                    id="hourly-radio-button"
                    name="group1"
                    label="Hourly"
                    onChange={() => {setQuoteType("hourly")}}
                    defaultChecked
                />
                <Form.Check
                    inline
                    type="radio"
                    id="fixed-radio-button"
                    name="group1"
                    label="Fixed"
                    onChange={() => {setQuoteType("fixed")}}
                />
            </Form>
            <br></br>
            <FormGroup label="Estimated Hours" value={estimatedHours.toString()} onChange={(e) => setEstimatedHours(parseInt(e.target.value))}/>
            <p>Start Date</p>
            <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} />
            <p>End Date</p>
            <DatePicker selected={endDate} onChange={(date: Date) => setEndDate(date)} />
            <br></br>
            <button className="delete-button" onClick={() => handleSubmit()}>Submit Quote</button>
        </>
    )
}