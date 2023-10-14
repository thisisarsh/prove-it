import { createBrowserRouter } from "react-router-dom";

import { Home } from "./routes/Home";
import { Login } from "./routes/Login";
import { ErrorPage } from "./error-page"

/**
 * Router for navigating to various routes in the website
 * All pages MUST go under /src/routes/<page.tsx>
 */
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
]);