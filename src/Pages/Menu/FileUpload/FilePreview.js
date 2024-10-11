import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../assets/style/FilePreview.css";
import { Link, useParams } from "react-router-dom";
import DataTable from "react-data-table-component";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import PdfViewer from "../../../components/Common/PdfViewer";

export default function FilePreview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [fileData, setFileData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [filePath, setFilePath] = useState("");
  const [processingTime, setProcessingTime] = useState("");
  const [limitations, setLimitations] = useState([]);
  useEffect(() => {
    const fetchLatestFile = async () => {
      const createdBy = Cookies.get("authToken");
      try {
        if (id) {
          const fileDetailsResponse = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/files/${id}`
          );
          setFileData(fileDetailsResponse.data);
          setLimitations(fileDetailsResponse.data.limitations);
          const summaryData = fileDetailsResponse.data.summary;
          const combinedData = summaryData.Section.map((Section, index) => ({
            Section: Section,
            Notes: summaryData.Notes[index],
            Status: summaryData.Status[index],
          }));
          setCombinedData(combinedData);
          setFileName(fileDetailsResponse.data.filename);
          setProcessingTime(fileDetailsResponse.data.pt);
          setFilePath(fileDetailsResponse.data.path);
        } else {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/files`,
            {
              params: {
                createdBy: createdBy,
              },
            }
          );
          setFileData(response.data[0]);
          const summaryData = response.data[0].summary;
          setLimitations(response.data[0].limitations);
          const combinedData = summaryData.Section.map((Section, index) => ({
            Section: Section,
            Notes: summaryData.Notes[index],
            Status: summaryData.Status[index],
          }));
          setCombinedData(combinedData);
          setFileName(response.data[0].filename);
          setProcessingTime(response.data[0].pt);
          setFilePath(response.data[0].path);
        }
      } catch (error) {
        console.error("Error fetching latest file:", error);
      }
    };

    fetchLatestFile();
  }, [1]);

  const downloadFile = async () => {
    const fileName = fileData.filename;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/files/download/${fileName}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };

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
          {(row.Notes && row.Notes.length > 0) || row.Status === "Missing" ? (
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
      cell: (row) => (
        <div style={{ color: "red" }}>
          {row.Notes.map((note, index) => (
            <ul key={index}>
              <li>{note}</li>
            </ul>
          ))}
        </div>
      ),
      width: "40%",
      wrap: true,
    },
  ];
  return (
    <React.Fragment>
      <div className="page-content">
        <p className="navbar-2">PR Check Point</p>
        <p className="warning-navbar">
          Please re-verify the following sections{" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1rem"
            height="1rem"
            viewBox="0 0 16 16"
          >
            <path
              fill="black"
              fill-rule="evenodd"
              d="M10.159 10.72a.75.75 0 1 0 1.06 1.06l3.25-3.25L15 8l-.53-.53l-3.25-3.25a.75.75 0 0 0-1.061 1.06l1.97 1.97H1.75a.75.75 0 1 0 0 1.5h10.379z"
              clip-rule="evenodd"
            />
          </svg>
          <i>
            {limitations.map((limitation, index) => (
              <ul className="limits-ul" key={index}>
                <li>{limitation}</li>
              </ul>
            ))}
          </i>
        </p>
        <div className="main-card2">
          <div className="preview-content">
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
              <Link className="secondary-btn" to={"/dashboard"}>
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 37 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.51562 21.3906H5.20312C5.0498 21.3906 4.90275 21.4515 4.79433 21.56C4.68591 21.6684 4.625 21.8154 4.625 21.9688V30.0625C4.625 30.2158 4.68591 30.3629 4.79433 30.4713C4.90275 30.5797 5.0498 30.6406 5.20312 30.6406H7.51562C8.74225 30.6406 9.91864 30.1533 10.786 29.286C11.6533 28.4186 12.1406 27.2423 12.1406 26.0156C12.1406 24.789 11.6533 23.6126 10.786 22.7453C9.91864 21.8779 8.74225 21.3906 7.51562 21.3906ZM7.51562 29.4844H5.78125V22.5469H7.51562C8.43559 22.5469 9.31789 22.9123 9.9684 23.5628C10.6189 24.2134 10.9844 25.0957 10.9844 26.0156C10.9844 26.9356 10.6189 27.8179 9.9684 28.4684C9.31789 29.1189 8.43559 29.4844 7.51562 29.4844ZM31.6191 28.6172C31.674 28.6697 31.718 28.7326 31.7486 28.8022C31.7792 28.8717 31.7958 28.9466 31.7974 29.0226C31.799 29.0986 31.7856 29.1741 31.758 29.2449C31.7304 29.3157 31.6891 29.3804 31.6364 29.4352C31.2872 29.8112 30.865 30.112 30.3956 30.3193C29.9261 30.5265 29.4194 30.6359 28.9062 30.6406C26.6747 30.6406 24.8594 28.5652 24.8594 26.0156C24.8594 23.4661 26.6747 21.3906 28.9062 21.3906C29.4196 21.3957 29.9265 21.5055 30.3959 21.7133C30.8654 21.921 31.2875 22.2224 31.6364 22.5989C31.689 22.6538 31.7303 22.7184 31.7579 22.7892C31.7854 22.86 31.7988 22.9356 31.7972 23.0115C31.7956 23.0875 31.779 23.1624 31.7485 23.2319C31.7179 23.3015 31.674 23.3644 31.6191 23.417C31.5642 23.4695 31.4996 23.5108 31.4288 23.5384C31.358 23.5659 31.2824 23.5793 31.2065 23.5777C31.1305 23.5761 31.0556 23.5595 30.9861 23.529C30.9165 23.4984 30.8536 23.4545 30.8011 23.3996C30.5599 23.1359 30.2675 22.9243 29.9417 22.7776C29.6159 22.631 29.2635 22.5525 28.9062 22.5469C27.3164 22.5469 26.0156 24.1035 26.0156 26.0156C26.0156 27.9278 27.3164 29.4844 28.9062 29.4844C29.2635 29.4788 29.6159 29.4002 29.9417 29.2536C30.2675 29.107 30.5599 28.8953 30.8011 28.6316C30.8538 28.5769 30.9168 28.5332 30.9865 28.5028C31.0561 28.4725 31.1311 28.4562 31.2071 28.4548C31.2831 28.4535 31.3586 28.4671 31.4293 28.495C31.5 28.5228 31.5645 28.5644 31.6191 28.6172ZM18.5 21.3906C16.2684 21.3906 14.4531 23.4661 14.4531 26.0156C14.4531 28.5652 16.2684 30.6406 18.5 30.6406C20.7316 30.6406 22.5469 28.5652 22.5469 26.0156C22.5469 23.4661 20.7316 21.3906 18.5 21.3906ZM18.5 29.4844C16.9102 29.4844 15.6094 27.9278 15.6094 26.0156C15.6094 24.1035 16.9102 22.5469 18.5 22.5469C20.0898 22.5469 21.3906 24.1035 21.3906 26.0156C21.3906 27.9278 20.0898 29.4844 18.5 29.4844ZM6.9375 16.7656C7.09083 16.7656 7.23788 16.7047 7.3463 16.5963C7.45472 16.4879 7.51562 16.3408 7.51562 16.1875V5.78125C7.51562 5.62792 7.57653 5.48087 7.68495 5.37245C7.79337 5.26403 7.94042 5.20313 8.09375 5.20313H21.3906V12.7188C21.3906 12.8721 21.4515 13.0191 21.56 13.1275C21.6684 13.236 21.8154 13.2969 21.9688 13.2969H29.4844V16.1875C29.4844 16.3408 29.5453 16.4879 29.6537 16.5963C29.7621 16.7047 29.9092 16.7656 30.0625 16.7656C30.2158 16.7656 30.3629 16.7047 30.4713 16.5963C30.5797 16.4879 30.6406 16.3408 30.6406 16.1875V12.7188C30.6407 12.6428 30.6258 12.5676 30.5968 12.4974C30.5678 12.4272 30.5252 12.3635 30.4715 12.3097L22.3778 4.21598C22.324 4.16231 22.2603 4.11975 22.1901 4.09073C22.1199 4.06172 22.0447 4.04682 21.9688 4.04688H8.09375C7.63377 4.04688 7.19262 4.2296 6.86736 4.55486C6.5421 4.88012 6.35938 5.32127 6.35938 5.78125V16.1875C6.35938 16.3408 6.42028 16.4879 6.5287 16.5963C6.63712 16.7047 6.78417 16.7656 6.9375 16.7656ZM22.5469 6.01973L28.6663 12.1406H22.5469V6.01973Z"
                    fill="white"
                  />
                </svg>
                Upload another word file
              </Link>
            </div>

            <div className="table-card">
              <div className="table-datawrap">
                <div className="table-responsive">
                  <DataTable
                    columns={columns}
                    data={combinedData}
                    highlightOnHover
                  />
                </div>
              </div>
            </div>
            <div className="pt">
              <span className="pt-title">Processing Time:</span>{" "}
              <span className="pt-data">{processingTime}</span>
            </div>
          </div>
          <div className="preview-file">
            <div className="download-card">
              <div className="section-header-title">
                <h5 className="section-header-title">Review PR</h5>
              </div>
            </div>
            <div className="download-details">
              {fileName}
              <button className="download-btn" onClick={downloadFile}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="39"
                    height="39"
                    stroke="#1C304C"
                  />
                  <path
                    d="M30.5 21.75V28.75C30.5 28.9821 30.4078 29.2046 30.2437 29.3687C30.0796 29.5328 29.8571 29.625 29.625 29.625H10.375C10.1429 29.625 9.92038 29.5328 9.75628 29.3687C9.59219 29.2046 9.5 28.9821 9.5 28.75V21.75C9.5 21.5179 9.59219 21.2954 9.75628 21.1313C9.92038 20.9672 10.1429 20.875 10.375 20.875C10.6071 20.875 10.8296 20.9672 10.9937 21.1313C11.1578 21.2954 11.25 21.5179 11.25 21.75V27.875H28.75V21.75C28.75 21.5179 28.8422 21.2954 29.0063 21.1313C29.1704 20.9672 29.3929 20.875 29.625 20.875C29.8571 20.875 30.0796 20.9672 30.2437 21.1313C30.4078 21.2954 30.5 21.5179 30.5 21.75ZM19.3809 22.3691C19.4622 22.4504 19.5587 22.515 19.6649 22.559C19.7712 22.603 19.885 22.6257 20 22.6257C20.115 22.6257 20.2288 22.603 20.3351 22.559C20.4413 22.515 20.5378 22.4504 20.6191 22.3691L24.9941 17.9941C25.0754 17.9128 25.1398 17.8163 25.1838 17.71C25.2278 17.6038 25.2505 17.49 25.2505 17.375C25.2505 17.26 25.2278 17.1462 25.1838 17.04C25.1398 16.9337 25.0754 16.8372 24.9941 16.7559C24.9128 16.6746 24.8163 16.6102 24.71 16.5662C24.6038 16.5222 24.49 16.4995 24.375 16.4995C24.26 16.4995 24.1462 16.5222 24.04 16.5662C23.9337 16.6102 23.8372 16.6746 23.7559 16.7559L20.875 19.638V9.5C20.875 9.26794 20.7828 9.04538 20.6187 8.88128C20.4546 8.71719 20.2321 8.625 20 8.625C19.7679 8.625 19.5454 8.71719 19.3813 8.88128C19.2172 9.04538 19.125 9.26794 19.125 9.5V19.638L16.2441 16.7559C16.0799 16.5918 15.8572 16.4995 15.625 16.4995C15.3928 16.4995 15.1701 16.5918 15.0059 16.7559C14.8418 16.9201 14.7495 17.1428 14.7495 17.375C14.7495 17.6072 14.8418 17.8299 15.0059 17.9941L19.3809 22.3691Z"
                    fill="#1C304C"
                  />
                </svg>
              </button>
            </div>
            <div className="pdf-viewer">
              {filePath && <PdfViewer pdfFilePath={filePath} />}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
