import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SIGNUP_API = "https://apiqa.hometrumpeter.com/user/signup";



const API_KEY = import.meta.env.VITE_HT_API_KEY;
const headers = new Headers();
headers.append("Content-Type", "application/json");
if (API_KEY) {
    headers.append("xck", API_KEY);
}

export function useSignUp() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const signup = async (
        firstName: string,
        lastName: string,
        email: string,
        password: string,
    ) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch(SIGNUP_API, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({
                user: { firstName, lastName, email, password },
            }),
        });
        const json = await response.json();
        console.log(json);
        // Handle BAD/GOOD response
        if (!json.isSuccess) {
            setIsLoading(false);
            setError(json.message);
        } else{
            setIsLoading(false);
            navigate("/Login");
        }
    };

    return { signup, isLoading, error , setError};
}
