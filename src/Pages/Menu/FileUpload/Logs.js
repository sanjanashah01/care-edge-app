import React, { useEffect, useState } from "react";
import "../../../assets/style/Logs.css";
import axios from "axios";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import ExportCSV from "../Admin/ExportCSV";
export default function Logs() {
  const [fileData, setFileData] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchLatestFile = async () => {
      const createdBy = Cookies.get("authToken");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/files`,
          {
            params: {
              createdBy: createdBy,
            },
          }
        );
        setFileData(response.data);
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
      width: "5%",
    },
    {
      name: <span className="">Date</span>,
      selector: (row) => formatDate(row.timestamp),
      sortable: true,
      width: "10%",
    },
    {
      name: <span className="">Type of PR Selected </span>,
      selector: (row) =>
        row.selectedTypes
          .map((type) => type.split(",").join(" / "))
          .join(" / "),
      wrap: true,
      sortable: true,
      width: "25%",
    },
    {
      name: <span className="">File Name</span>,
      selector: (row) => row.filename,
      sortable: true,
      width: "25%",
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
      width: "26%",
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
          <Link to={`/file-preview/${row._id}`}>
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
      width: "9%",
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
    return (
      (item.filename && item.filename.toLowerCase().includes(searchTerm)) ||
      (item.timestamp &&
        formatDate(item.timestamp).toLowerCase().includes(searchTerm)) ||
      (item.selectedTypes &&
        item.selectedTypes.join(" ").toLowerCase().includes(searchTerm)) ||
      (item.summary &&
        item.summary.Notes &&
        item.summary.Notes.some((note) =>
          Object.values(note).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(searchTerm)
          )
        )) ||
      (getStatus(item) && getStatus(item).toLowerCase().includes(searchTerm))
    );
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <p className="navbar-2">History</p>
        <div className="main-card">
          <div className="container1">
            <div className="logs-buttons">
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
              <div className="search-input">
                <input
                  className="search-btn"
                  type="text"
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  placeholder="Search"
                />
                <div className="search-icon">
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
            <div>
              <ExportCSV data={filteredItems} />
            </div>
            <DataTable columns={columns} data={filteredItems} pagination />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
