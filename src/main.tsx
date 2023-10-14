import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { Router } from './router'

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.css'

/**
 * Entry point into the React app
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={Router} />
  </React.StrictMode>
);