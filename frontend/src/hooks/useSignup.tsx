import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SIGNUP_LINK = import.meta.env.VITE_SERVER + "/signup";

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

        const response = await fetch(SIGNUP_LINK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
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
