import React, { useEffect, useState } from "react";
import "../../../assets/style/AdminDashboard.css";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import ProfileMenu from "../../../components/Common/TopbarDropdown/ProfileMenu";
import ExportCSV from "./ExportCSV";
export default function AdminLogs() {
  const [fileData, setFileData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchLatestFile = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/files/all-files`
        );
        setFileData(response.data);

        const userResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user`
        );
        setUserData(userResponse.data);
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    fetchLatestFile();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const downloadFile = async (id, filename) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/files/download/${id}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };

  const columns = [
    {
      name: "No.",
      cell: (row, index) => <div>{index + 1}</div>,
      wrap: true,
      width: "8%",
      sortable: true,
    },
    {
      name: <span className="">Date</span>,
      selector: (row) => formatDate(row.timestamp),
      sortable: true,
      width: "9%",
      wrap: true,
    },
    {
      name: "User",
      selector: (row) => {
        const createdBy = row.createdBy;
        const userEmail = userData.find((user) => user._id === createdBy);
        return userEmail ? userEmail.email : "Unknown";
      },
      sortable: true,
      width: "15%",
      wrap: true,
    },
    {
      name: <span className="">Type of PR Selected </span>,
      selector: (row) =>
        row.selectedTypes
          .map((type) => type.split(",").join(" / "))
          .join(" / "),
      wrap: true,
      sortable: true,
      width: "15%",
    },
    {
      name: <span className="">File Name</span>,
      selector: (row) => row.filename,
      sortable: true,
      width: "25%",
      wrap: true,
    },
    {
      name: <span>Status (Ready for publication/Corrections required)</span>,
      selector: (row) => {
        if (row.summary && row.summary.Notes) {
          for (let i = 0; i < row.summary.Notes.length; i++) {
            if (row.summary.Notes[i].length > 0) {
              return "Corrections required";
            }
          }
        }
        return "Ready for Publication	";
      },
      sortable: true,
      wrap: true,
      width: "18%",
    },
    {
      name: <span>Actions</span>,
      selector: (row) => (
        <div className="download-btn">
          <button
            className="log-download"
            onClick={() => downloadFile(row._id, row.filename)}
          >
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="0.5" y="0.5" width="39" height="39" />
              <path
                d="M30.5 21.75V28.75C30.5 28.9821 30.4078 29.2046 30.2437 29.3687C30.0796 29.5328 29.8571 29.625 29.625 29.625H10.375C10.1429 29.625 9.92038 29.5328 9.75628 29.3687C9.59219 29.2046 9.5 28.9821 9.5 28.75V21.75C9.5 21.5179 9.59219 21.2954 9.75628 21.1313C9.92038 20.9672 10.1429 20.875 10.375 20.875C10.6071 20.875 10.8296 20.9672 10.9937 21.1313C11.1578 21.2954 11.25 21.5179 11.25 21.75V27.875H28.75V21.75C28.75 21.5179 28.8422 21.2954 29.0063 21.1313C29.1704 20.9672 29.3929 20.875 29.625 20.875C29.8571 20.875 30.0796 20.9672 30.2437 21.1313C30.4078 21.2954 30.5 21.5179 30.5 21.75ZM19.3809 22.3691C19.4622 22.4504 19.5587 22.515 19.6649 22.559C19.7712 22.603 19.885 22.6257 20 22.6257C20.115 22.6257 20.2288 22.603 20.3351 22.559C20.4413 22.515 20.5378 22.4504 20.6191 22.3691L24.9941 17.9941C25.0754 17.9128 25.1398 17.8163 25.1838 17.71C25.2278 17.6038 25.2505 17.49 25.2505 17.375C25.2505 17.26 25.2278 17.1462 25.1838 17.04C25.1398 16.9337 25.0754 16.8372 24.9941 16.7559C24.9128 16.6746 24.8163 16.6102 24.71 16.5662C24.6038 16.5222 24.49 16.4995 24.375 16.4995C24.26 16.4995 24.1462 16.5222 24.04 16.5662C23.9337 16.6102 23.8372 16.6746 23.7559 16.7559L20.875 19.638V9.5C20.875 9.26794 20.7828 9.04538 20.6187 8.88128C20.4546 8.71719 20.2321 8.625 20 8.625C19.7679 8.625 19.5454 8.71719 19.3813 8.88128C19.2172 9.04538 19.125 9.26794 19.125 9.5V19.638L16.2441 16.7559C16.0799 16.5918 15.8572 16.4995 15.625 16.4995C15.3928 16.4995 15.1701 16.5918 15.0059 16.7559C14.8418 16.9201 14.7495 17.1428 14.7495 17.375C14.7495 17.6072 14.8418 17.8299 15.0059 17.9941L19.3809 22.3691Z"
                fill="#1C304C"
              />
            </svg>
          </button>
          <Link to={`/admin-file-preview/${row._id}`}>
            <button className="log-download">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 1024 1024"
              >
                <path
                  fill="#1C304C"
                  d="m576 736l-32-.001v-286c0-.336-.096-.656-.096-1.008s.096-.655.096-.991c0-17.664-14.336-32-32-32h-64c-17.664 0-32 14.336-32 32s14.336 32 32 32h32v256h-32c-17.664 0-32 14.336-32 32s14.336 32 32 32h128c17.664 0 32-14.336 32-32s-14.336-32-32-32m-64-384.001c35.344 0 64-28.656 64-64s-28.656-64-64-64s-64 28.656-64 64s28.656 64 64 64m0-352c-282.768 0-512 229.232-512 512c0 282.784 229.232 512 512 512c282.784 0 512-229.216 512-512c0-282.768-229.216-512-512-512m0 961.008c-247.024 0-448-201.984-448-449.01c0-247.024 200.976-448 448-448s448 200.977 448 448s-200.976 449.01-448 449.01"
                />
              </svg>
            </button>
          </Link>
        </div>
      ),
      sortable: true,
      wrap: true,
      width: "10%",
    },
  ];

  const getStatus = (item) => {
    if (item.summary && item.summary.Notes) {
      for (let i = 0; i < item.summary.Notes.length; i++) {
        if (item.summary.Notes[i].length > 0) {
          return "Corrections required";
        }
      }
    }
    return "Ready for Publication";
  };

  const filteredItems = fileData.filter((item) => {
    const searchTerm = filterText.toLowerCase();

    const createdByUser = userData.find((user) => user._id === item.createdBy);
    const userEmail = createdByUser
      ? createdByUser.email.toLowerCase()
      : "unknown";

    return (
      (item.timestamp &&
        formatDate(item.timestamp).toLowerCase().includes(searchTerm)) ||
      (item.selectedTypes &&
        item.selectedTypes.join(" ").toLowerCase().includes(searchTerm)) ||
      (item.filename && item.filename.toLowerCase().includes(searchTerm)) ||
      (item.summary &&
        item.summary.Notes &&
        item.summary.Notes.some((note) =>
          Object.values(note).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchTerm)
          )
        )) ||
      (getStatus(item) && getStatus(item).toLowerCase().includes(searchTerm)) ||
      userEmail.includes(searchTerm)
    );
  });

  return (
    <React.Fragment>
      <div className="admin-dashboard">
        <div className="admin-navbar">
          <div className="search-menu">
            <div className="admin-search-input">
              <input
                className="admin-search-btn"
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search"
              />
              <div className="admin-search-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#959595"
                    d="M4.5 10a5.5 5.5 0 1 1 11 0a5.5 5.5 0 0 1-11 0M10 3a7 7 0 1 0 4.391 12.452l5.329 5.328a.75.75 0 1 0 1.06-1.06l-5.328-5.329A7 7 0 0 0 10 3"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="user-menu">
            <ProfileMenu />
          </div>
        </div>
        <div className="admin-main-card">
          <div className="admin-card-header">
            <div></div>
            <div>{/* <ExportCSV data={filteredItems} /> */}</div>
          </div>
          <div className="admin-card-data">
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "20px",
                width: "100%",
              }}
            >
              <DataTable columns={columns} data={filteredItems} pagination />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
