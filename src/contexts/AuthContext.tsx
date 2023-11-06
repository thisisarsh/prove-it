import React, { createContext, useReducer, ReactNode, Dispatch } from "react";

// Define the AuthState and AuthAction types
export interface AuthState {
    user: { data: {
            id: string,
            firstName: string,
            lastName: string,
            email: string,
            userName: string,
            roleName: string,
            emailVerified: boolean,
            phoneVerified: boolean,
            isRegistered: boolean
        },
        isSuccess: boolean, } | null;
}

export interface AuthAction {
    type: "LOGIN" | "LOGOUT";
    payload?: { data: {
            id: string,
            firstName: string,
            lastName: string,
            email: string,
            userName: string,
            roleName: string,
            emailVerified: boolean,
            phoneVerified: boolean,
            isRegistered: boolean
        },
        isSuccess: boolean, } | null;
}

export const AuthContext = createContext<{ state: AuthState; dispatch: Dispatch<AuthAction> } | undefined>(undefined);

const authReducer = (state: AuthState,  action: AuthAction): AuthState => {
    switch (action.type) {
        case "LOGIN":
            console.log(action.payload);
            console.log("action.payload");
            return { user: action.payload || null }; // Provide a default value of null if action.payload is undefined
        case "LOGOUT":
            return { user: null };
        default:
            return state;
    }
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
    });

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

