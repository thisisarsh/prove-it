import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export const ProtectedRoute = ({ redirect, children }: { redirect: string; children: React.ReactNode }) => {
    const { state } = useAuthContext();
    const user = state.user;

    if (!user) {
        return <Navigate to={redirect} />;
    } else if (!user.phoneVerified) {
        return <Navigate to="/verifyphone" />;
    } else if (!user.role) {
        return <Navigate to="/setrole" />;
    }
    return children;
};
