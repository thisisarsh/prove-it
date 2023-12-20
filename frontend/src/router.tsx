/**
 * Router for navigating to various routes in the website
 * All pages MUST go under /src/routes/<page.tsx>
 */

import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";
import { ErrorPage } from "./error-page";
import { Dashboard } from "./routes/Dashboard";
import { VerifyPhone } from "./routes/VerifyPhone";
import { SignUp } from "./routes/SignUp";
import { VerifyOTP } from "./routes/VerifyOTP";
import { SetRole } from "./routes/SetRole";
import { AddProperty } from "./routes/AddProperty";
import { InviteTenant } from "./routes/InviteTenant";
import { InviteServiceProvider } from "./routes/InviteServiceProvider";
import { InvitedSignup } from "./routes/InvitedSignup";
import { TenantOnboarding } from "./routes/TenantOnboarding";
import { SignupRole } from "./routes/SignupRole";

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
        path: "/dashboard",
        element: (
            <ProtectedRoute redirect="/login">
                <Dashboard />
            </ProtectedRoute>
        ),
        errorElement: <ErrorPage />,
    },
    {
        path: "/signup",
        element: <SignupRole />,
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
        errorElement: <ErrorPage />,
    },
    {
        path: "/signup/invited",
        element: <InvitedSignup />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/signup/owner",
        element: <SignUp />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/onboarding/tenant",
        element: <TenantOnboarding />,
        errorElement: <ErrorPage />,
    },
]);
