import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export const ProtectedRoute = ({ redirect, children }: { redirect: string; children: React.ReactNode }) => {
    const { state } = useAuthContext();
    const { user } = state;
    console.log(user);

    if (!user) {
        // user is not authenticated
        return <Navigate to={redirect} />;
    } else if (!user.data.roleName) {
        return <Navigate to="/setrole" />;
    } else if (!user.data.phoneVerified) {
        return <Navigate to="/verifyphone" />;
    }
    return children;
};
