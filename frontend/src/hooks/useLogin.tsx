import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";
import { User } from "../types"

const LOGIN_LINK = import.meta.env.VITE_SERVER + "/login";

export function useLogin() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError("");

        // API call
        const response = await fetch(LOGIN_LINK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const json = await response.json();

        // Handle BAD/GOOD response
        if (response.status === 200) {
            setIsLoading(false);

            const user : User = json.user;
            console.log(user);
            dispatch({ type: "LOGIN", payload: { user } });
            
            if (user.phoneVerified && user.role?.role) {
                navigate('/dashboard');
            } else if (user.phoneVerified) {
                navigate('/setrole');
            } else {
                navigate('/verifyphone');
            }
        } else {
            console.log("Login failure")
            setIsLoading(false);
            setError(json.message);
        }
    };

    return { login, isLoading, error };
}
