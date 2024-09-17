import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const userRole = JSON.parse(Cookies.get("userRole"));

  if (userRole === "admin") {
    return <Component {...rest} />;
  } else {
    return <Navigate to="/sign-in" />;
  }
};

export default ProtectedRoute;
