import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/style/FilePreview.css";
import { Link, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "../../../components/Common/TopbarDropdown/ProfileMenu";

export default function AdminFilePreview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [combinedData, setCombinedData] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [processingTime, setProcessingTime] = useState("");
  useEffect(() => {
    const fetchLatestFile = async () => {
      const createdBy = Cookies.get("authToken");
      try {
        if (id) {
          const fileDetailsResponse = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/files/${id}`
          );
          const summaryData = fileDetailsResponse.data.summary;
          const combinedData = summaryData.Section.map((Section, index) => ({
            Section: Section,
            Notes: summaryData.Notes[index],
            Status: summaryData.Status[index],
          }));
          setCombinedData(combinedData);
          setFileName(fileDetailsResponse.data.filename);
          setProcessingTime(fileDetailsResponse.data.pt);
        } else {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/files`,
            {
              params: {
                createdBy: createdBy,
              },
            }
          );
          const summaryData = response.data[0].summary;
          const combinedData = summaryData.Section.map((Section, index) => ({
            Section: Section,
            Notes: summaryData.Notes[index],
            Status: summaryData.Status[index],
          }));
          setCombinedData(combinedData);
          setFileName(response.data[0].filename);
          setProcessingTime(response.data[0].pt);
        }
      } catch (error) {
        console.error("Error fetching latest file:", error);
      }
    };

    fetchLatestFile();
  });

  const columns = [
    {
      name: "No.",
      cell: (row, index) => <div>{index + 1}</div>,
      width: "10%",
      wrap: true,
    },
    {
      name: "Parameters",
      cell: (row) => <div>{row.Section}</div>,
      width: "30%",
      wrap: true,
    },
    {
      name: "Validation",
      cell: (row) => (
        <div className="validation">
          {row.Notes && row.Notes.length > 0 ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
            >
              <path
                fill="#d01111"
                d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
            >
              <path
                fill="#1f8e1f"
                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"
              />
            </svg>
          )}
        </div>
      ),
      width: "20%",
      wrap: true,
    },
    {
      name: "Remarks",
      cell: (row) => <div style={{ color: "red" }}>{row.Notes}</div>,
      width: "40%",
      wrap: true,
    },
  ];
  return (
    <React.Fragment>
      <div className="admin-dashboard">
        <div className="admin-navbar">
          <div className="search-menu"></div>
          <div className="user-menu">
            <ProfileMenu />
          </div>
        </div>
        <div className="admin-main-card">
          <div className="admin-card-data">
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "20px",
                width: "100%",
              }}
            >
              <div className="buttons">
                <Link className="back-btn" onClick={() => navigate(-1)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#1c304c"
                      d="M12.707 17.293L8.414 13H18v-2H8.414l4.293-4.293l-1.414-1.414L4.586 12l6.707 6.707z"
                    />
                  </svg>
                  Back
                </Link>
                {fileName}
                <div className="pt">
                  <span className="pt-title">Processing Time:</span>{" "}
                  <span className="pt-data">{processingTime}</span>
                </div>
              </div>
              <DataTable
                columns={columns}
                data={combinedData}
                highlightOnHover
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
