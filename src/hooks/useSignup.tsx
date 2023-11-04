import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SIGNUP_API = "https://apiqa.hometrumpeter.com/user/signup";

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
        console.log(isLoading);

        const response = await fetch(SIGNUP_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                xck: import.meta.env.VITE_HT_API_KEY,
            },
            body: JSON.stringify({
                user: { firstName, lastName, email, password },
            }),
        });
        const json = await response.json();

        // Handle BAD/GOOD response
        if (json.isSuccess == false) {
            setIsLoading(false);
            setError(json.error);
        } else if (json.isSuccess == true) {
            setIsLoading(false);
            navigate("/Login");
        }
    };

    return { signup, isLoading, error };
}
