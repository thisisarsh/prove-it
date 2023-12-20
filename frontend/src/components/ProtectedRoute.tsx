import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export const ProtectedRoute = ({
    redirect,
    children,
}: {
    redirect: string;
    children: React.ReactNode;
}) => {
    const { state } = useAuthContext();
    const user = state.user;

    if (!user) {
        return <Navigate to={redirect} />;
    }
    return children;
};
