/**
 * Router for navigating to various routes in the website
 * All pages MUST go under /src/routes/<page.tsx>
 */

import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";
import { ErrorPage } from "./error-page";
import { DashboardOwner } from "./routes/DashboardOwner";
import { DashboardTenant } from "./routes/DashboardTenant";
import { VerifyPhone } from "./routes/VerifyPhone";
import { SignUp } from "./routes/SignUp";
import { VerifyOTP } from "./routes/VerifyOTP";
import { SetRole } from "./routes/SetRole";
import { AddProperty } from "./routes/AddProperty";
import { InviteTenant } from "./routes/InviteTenant";
import { InviteServiceProvider } from "./routes/InviteServiceProvider";

export const Router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboardowner",
        element: (
            <ProtectedRoute redirect="/login">
                <DashboardOwner />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/dashboardtenant",
        element: (
            <ProtectedRoute redirect="/login">
                <DashboardTenant />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/signup",
        element: <SignUp />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/verifyphone",
        element: <VerifyPhone />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/verifyotp",
        element: <VerifyOTP />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/setrole",
        element: <SetRole />,
        errorElement: <ErrorPage />,
    },
    {
        //TODO: Protect this route
        path: "/addproperty",
        element: <AddProperty />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/invite/tenant",
        element: <InviteTenant />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/invite/serviceprovider",
        element: <InviteServiceProvider />,
        errorElement: <ErrorPage />
    },
]);
