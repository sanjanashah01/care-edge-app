import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../Pages/Dashboard";

// Import Utility Pages
import Maintenance from "../Pages/Utility/Maintenance-Page";
import ComingSoon from "../Pages/Utility/ComingSoon-Page";
import Error404 from "../Pages/Utility/Error404-Page";
import Error500 from "../Pages/Utility/Error500-Page";

import Signin from "../Pages/Authentication/Signin.js";
import Logout from "../Pages/Authentication/Logout.js";
import ProtectedRoute from "../Pages/Dashboard/ProtectedRoute.js";
import FileUploader from "../Pages/Menu/FileUpload/FileUploader.js";
import FilePreview from "../Pages/Menu/FileUpload/FilePreview.js";
import Logs from "../Pages/Menu/FileUpload/Logs.js";
import AdminDashboard from "../Pages/Menu/Admin/AdminDashboard.js";
import AdminLogs from "../Pages/Menu/Admin/AdminLogs.js";
import AdminFilePreview from "../Pages/Menu/Admin/AdminFilePreview.js";

const authProtectedRoutes = [
  //Admin
  { path: "/admin", component: <ProtectedRoute component={AdminDashboard} role="admin"/> },
  { path: "/admin-logs", component: <ProtectedRoute component={AdminLogs} /> },
  {
    path: "/admin-file-preview/:id",
    component: <ProtectedRoute component={AdminFilePreview} />,
  },
  //dashboard
  // File
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/file", component: <FilePreview /> },
  { path: "/file-upload", component: <FileUploader /> },
  { path: "/file-preview", component: <FilePreview /> },
  { path: "/file-preview/:id", component: <FilePreview /> },
  { path: "/logs", component: <Logs /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/sign-in", component: <Signin /> },

  // Utility Pages
  { path: "/pages-404", component: <Error404 /> },
  { path: "/pages-500", component: <Error500 /> },
  { path: "/pages-maintenance", component: <Maintenance /> },
  { path: "/pages-comingsoon", component: <ComingSoon /> },
];

export { authProtectedRoutes, publicRoutes };
