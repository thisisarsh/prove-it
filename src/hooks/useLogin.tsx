import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

const LOGIN_API = "https://apiqa.hometrumpeter.com/user/login";

export function useLogin() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        // API call
        const response = await fetch(LOGIN_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                xck: import.meta.env.VITE_HT_API_KEY,
            },
            body: JSON.stringify({ email, password }),
        });

        const json = await response.json();

        // let json = {
        //     "data": {
        //         "id": "sh2345",
        //         "firstName": "Arshjot",
        //         "lastName": "Singh",
        //         "email": "arshjots11@gmail.com",
        //         "userName": "thisisarsh",
        //         "roleName": "manager",
        //         "emailVerified": true,
        //         "phoneVerified": false,
        //         "isRegistered": true
        //     },
        //     "isSuccess": true,
        //     "error": null,
        // }
        // Handle BAD/GOOD response
        if (!json.isSuccess) {
            setIsLoading(false);
            setError(json.error);
        } else if (json.isSuccess) {
            setIsLoading(false);
            localStorage.setItem("user", JSON.stringify(json)); // save user data to local storage
            console.log(json)
            dispatch({ type: "LOGIN", payload: json }); // use AuthContext
            navigate("/Dashboard");
        }
    };

    return { login, isLoading, error };
}
