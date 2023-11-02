import { Navigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

export const ProtectedRoute = ({ redirect: string, children }) => {
  const { user }: any = useAuthContext();
  console.log("USER");
  console.log(user);

  if (!user) {
    // user is not authenticated
    return <Navigate to={redirect} />;
  } else if (!user.data.roleName) {
    return <Navigate to="/setrole" />;
  } else if (!user.data.user.phoneVerified) {
    return <Navigate to="/verifyphone" />;
  }
  return children;
};
