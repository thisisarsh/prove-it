import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export const ProtectedRoute = ({ redirect, children }) => {
  const { user } = useAuthContext();
  if (!user) {
    // user is not authenticated
    return <Navigate to={redirect} />;
  }
  return children;
};
