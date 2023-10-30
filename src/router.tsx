/**
 * Router for navigating to various routes in the website
 * All pages MUST go under /src/routes/<page.tsx>
 */

import { createBrowserRouter } from "react-router-dom";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";
import { ErrorPage } from "./error-page"
import { Dashboard } from "./routes/Dashboard";
import { VerifyPhone } from "./routes/VerifyPhone";

// NEED TO PROTECT "Dashboard" ROUTE
export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />
  },
  {
    path: "/verifyphone",
    element: <VerifyPhone />,
    errorElement: <ErrorPage />
  },
]);