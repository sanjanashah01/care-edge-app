import React from "react";
import FileUploader from "../Menu/FileUpload/FileUploader";
import Cookies from "js-cookie";
import AdminDashboard from "../Menu/Admin/AdminDashboard";

const Dashboard = () => {
  const userRole = JSON.parse(Cookies.get("userRole"));
  if (userRole === "admin") {
    return <AdminDashboard />;
  } else {
    return (
      <React.Fragment>
        <FileUploader />
      </React.Fragment>
    );
  }
};

export default Dashboard;
