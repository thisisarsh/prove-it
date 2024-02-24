import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigation } from "@react-navigation/native";
import { User } from "../../types"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {StackNavigationProp} from "@react-navigation/stack";

type RootStackParamList = {
    DashboardOwner: undefined;
    DashboardTenant: undefined;
    DashboardService: undefined;
    HomeownerDashboard: undefined;
};

export function useLogin() {
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError("");

        const serverAddress = "http://localhost:8080";

        const LOGIN_LINK = serverAddress + "/login";
        console.log(serverAddress)
        console.log(LOGIN_LINK);

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
            AsyncStorage.setItem("user", JSON.stringify(user))
            dispatch({ type: "LOGIN", payload: { user } });
            
            if (user.phoneVerified && user.role?.role) {
                switch (user.role?.role) {
                    case "owner":
                    case "manager":
                        navigation.navigate("HomeownerDashboard");
                        break;
                    case "tenant":
                        navigation.navigate("DashboardTenant");
                        break;
                    case "service_provider":
                        navigation.navigate("DashboardService");
                        break;
                    default:
                        throw new Error(`No dashboard route for user's role of ${user.role?.role}`);
                }
            }
            // TODO: Add screens for these navs
            // else if (user.phoneVerified) {
            //     navigation.navigate('/setrole');
            // } else {
            //     navigation.navigate('/verifyphone');
            // }
        } else {
            console.log("Login failure")
            setIsLoading(false);
            setError(json.message);
        }
    };

    return { login, isLoading, error };
}
