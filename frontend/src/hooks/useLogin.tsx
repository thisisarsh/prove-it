import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

const LOGIN_LINK = import.meta.env.VITE_SERVER + "/login";

export function useLogin() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        // API call
        const response = await fetch(LOGIN_LINK, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password }),
        });

        const json = await response.json();

        // Handle BAD/GOOD response
        if (response.status === 200) {
            setIsLoading(false);
            localStorage.setItem("token", JSON.stringify(json.token));
            dispatch({ type: "LOGIN", payload: {user: json.user, role: json.role} }); // use AuthContext
            navigate("/Dashboard");
        } else {
            setIsLoading(false);
            setError(json.error);
        }
    };

    return { login, isLoading, error };
}
