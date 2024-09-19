import React, { useEffect, useState } from "react";
import "../../../assets/style/AdminDashboard.css";
import ProfileMenu from "../../../components/Common/TopbarDropdown/ProfileMenu";
import { Button, Card } from "reactstrap";
import contract1 from "../../../assets/images/contract1.png";
import axios from "axios";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import Select from "react-select";
import { DateRangePicker } from "rsuite";

export default function AdminDashboard() {
  const [correctionRequired, setCorrectionRequired] = useState(0);
  const [publicationReady, setPublicationReady] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [options, setOptions] = useState({
    chart: {
      width: 380,
      type: "pie",
    },
    labels: ["Corrections required", "Ready for Publication"],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
    },
    colors: ["#1C304C", "#0FDCD2"],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [pieChartData, setPieChartData] = useState([
    { name: "Corrections required", value: 0 },
    { name: "Ready for Publication", value: 0 },
  ]);

  //Fetching all files data
  useEffect(() => {
    const fetchAllFiles = async () => {
      try {
        const fileResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/files/all-files`
        );
        const data = fileResponse.data;

        const statusCounts = data.reduce((acc, file) => {
          acc[file.prStatus] = (acc[file.prStatus] || 0) + 1;
          return acc;
        }, {});

        const pieData = Object.entries(statusCounts).map(([status, count]) => ({
          name: status,
          value: count,
        }));
        if (pieData[0]) {
          if (pieData[0].name === "Corrections required") {
            if (pieData[0]) setCorrectionRequired(pieData[0].value);
            else setCorrectionRequired(0);

            if (pieData[1]) setPublicationReady(pieData[1].value);
            else setPublicationReady(0);
          } else {
            if (pieData[1]) setCorrectionRequired(pieData[1].value);
            else setCorrectionRequired(0);
            if (pieData[0]) setPublicationReady(pieData[0].value);
            else setPublicationReady(0);
          }
        } else setCorrectionRequired(0);
        if (pieData[1]) {
          if (pieData[0].name === "Corrections required") {
            setCorrectionRequired(pieData[0].value);
            setPublicationReady(pieData[1].value);
          } else {
            setCorrectionRequired(pieData[1].value);
            setPublicationReady(pieData[0].value);
          }
        } else setPublicationReady(0);
        setPieChartData(pieData);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchAllFiles();
  }, []);

  //Fetching user dropdown data
  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const userResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/user`
        );

        setIsDataLoaded(true);

        const userData = userResponse.data;
        const userOptions = userData.map((user) => ({
          value: user._id,
          label: user.email,
        }));
        setUserOptions(userOptions);
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    fetchFileData();
  }, []);

  const handleDateChange = async (value) => {
    if (value) {
      setSelectedDate(value);
      const [startDate, endDate] = value;

      if (selectedUser) {
        const userId = selectedUser.value;
        try {
          const fileResponse = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/files/all-files`
          );
          const data = fileResponse.data;

          const userFiles = data.filter((file) => file.createdBy === userId);
          const parseData = (files, startDate, endDate) => {
            const correctionsRequiredCount = files.filter(
              (file) =>
                file.prStatus === "Corrections required" &&
                moment(file.dateCreated, "DD/MM/YYYY").isBetween(
                  startDate,
                  endDate,
                  undefined,
                  "[]"
                )
            ).length;

            const publicationReadyCount = files.filter(
              (file) =>
                file.prStatus === "Ready for Publication" &&
                moment(file.dateCreated, "DD/MM/YYYY").isBetween(
                  startDate,
                  endDate,
                  undefined,
                  "[]"
                )
            ).length;

            return { correctionsRequiredCount, publicationReadyCount };
          };

          const { correctionsRequiredCount, publicationReadyCount } = parseData(
            userFiles,
            startDate,
            endDate
          );
          setCorrectionRequired(correctionsRequiredCount);
          setPublicationReady(publicationReadyCount);
          setPieChartData([
            { name: "Corrections required", value: correctionsRequiredCount },
            { name: "Ready for Publication", value: publicationReadyCount },
          ]);
          setIsDataLoaded(true);
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      } else {
        try {
          const fileResponse = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/files/pr-count`
          );
          const data = fileResponse.data;
          let correctionsRequiredCount, publicationReadyCount;
          if (data["correctionsRequired"]) {
            correctionsRequiredCount = data["correctionsRequired"][
              "dates"
            ].filter((date) =>
              moment(date, "DD/MM/YYYY").isBetween(
                startDate,
                endDate,
                undefined,
                "[]"
              )
            ).length;
          } else {
            correctionsRequiredCount = 0;
          }
          if (data["readyForPublication"]) {
            publicationReadyCount = data["readyForPublication"]["dates"].filter(
              (date) =>
                moment(date, "DD/MM/YYYY").isBetween(
                  startDate,
                  endDate,
                  undefined,
                  "[]"
                )
            ).length;
          } else {
            publicationReadyCount = 0;
          }
          setCorrectionRequired(correctionsRequiredCount);
          setPublicationReady(publicationReadyCount);
          setPieChartData([
            { name: "Corrections required", value: correctionsRequiredCount },
            { name: "Ready for Publication", value: publicationReadyCount },
          ]);
          setIsDataLoaded(true);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    }
  };

  //Updating pieChart if date is selected or not
  const handleUserChange = async (selectedOption) => {
    setSelectedUser(selectedOption);

    if (selectedOption) {
      const userId = selectedOption.value;

      if (selectedDate) {
        const [startDate, endDate] = selectedDate;
        try {
          const fileResponse = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/files/all-files`
          );
          const data = fileResponse.data;
          const userFiles = data.filter((file) => file.createdBy === userId);
          const parseData = (files, startDate, endDate) => {
            const correctionsRequiredCount = files.filter(
              (file) =>
                file.prStatus === "Corrections required" &&
                moment(file.dateCreated, "DD/MM/YYYY").isBetween(
                  startDate,
                  endDate,
                  undefined,
                  "[]"
                )
            ).length;

            const publicationReadyCount = files.filter(
              (file) =>
                file.prStatus === "Ready for Publication" &&
                moment(file.dateCreated, "DD/MM/YYYY").isBetween(
                  startDate,
                  endDate,
                  undefined,
                  "[]"
                )
            ).length;

            return { correctionsRequiredCount, publicationReadyCount };
          };

          const { correctionsRequiredCount, publicationReadyCount } = parseData(
            userFiles,
            startDate,
            endDate
          );

          setCorrectionRequired(correctionsRequiredCount);
          setPublicationReady(publicationReadyCount);
          setPieChartData([
            { name: "Corrections required", value: correctionsRequiredCount },
            { name: "Ready for Publication", value: publicationReadyCount },
          ]);
          setIsDataLoaded(true);
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      } else {
        try {
          const fileResponse = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/files/all-files`
          );
          const data = fileResponse.data;

          const userFiles = data.filter((file) => file.createdBy === userId);

          const statusCounts = userFiles.reduce((acc, file) => {
            acc[file.prStatus] = (acc[file.prStatus] || 0) + 1;
            return acc;
          }, {});

          const correctionsRequiredCount =
            statusCounts["Corrections required"] || 0;
          const publicationReadyCount =
            statusCounts["Ready for Publication"] || 0;

          setCorrectionRequired(correctionsRequiredCount);
          setPublicationReady(publicationReadyCount);
          setPieChartData([
            { name: "Corrections required", value: correctionsRequiredCount },
            { name: "Ready for Publication", value: publicationReadyCount },
          ]);
          setIsDataLoaded(true);
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      }
    }
  };

  const handleClearFilter = async () => {
    try {
      const fileResponse = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/files/all-files`
      );
      const data = fileResponse.data;

      const statusCounts = data.reduce((acc, file) => {
        acc[file.prStatus] = (acc[file.prStatus] || 0) + 1;
        return acc;
      }, {});

      const pieData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        value: count,
      }));
      if (pieData[0]) {
        if (pieData[0].name === "Corrections required") {
          if (pieData[0]) setCorrectionRequired(pieData[0].value);
          else setCorrectionRequired(0);

          if (pieData[1]) setPublicationReady(pieData[1].value);
          else setPublicationReady(0);
        } else {
          if (pieData[1]) setCorrectionRequired(pieData[1].value);
          else setCorrectionRequired(0);
          if (pieData[0]) setPublicationReady(pieData[0].value);
          else setPublicationReady(0);
        }
      } else setCorrectionRequired(0);
      if (pieData[1]) {
        if (pieData[0].name === "Corrections required") {
          setCorrectionRequired(pieData[0].value);
          setPublicationReady(pieData[1].value);
        } else {
          setCorrectionRequired(pieData[1].value);
          setPublicationReady(pieData[0].value);
        }
      } else setPublicationReady(0);
      setPieChartData(pieData);
      setIsDataLoaded(true);
      setSelectedDate("");
      setSelectedUser(null);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };
  return (
    <React.Fragment>
      <div className="admin-dashboard">
        <div className="admin-navbar">
          <div className="search-menu">
            <div className="admin-filters">
              <Select
                name="search"
                options={userOptions}
                onChange={handleUserChange}
                value={selectedUser}
              />
            </div>
          </div>
          <div className="date-filter">
            <DateRangePicker
              placeholder="Select Date Range"
              onChange={handleDateChange}
              value={selectedDate ? [selectedDate[0], selectedDate[1]] : null}
            />
          </div>
          <div className="date-filter">
            <Button onClick={handleClearFilter} className="clear-btn">
              Clear filters
            </Button>
          </div>
          <div className="user-menu">
            <ProfileMenu />
          </div>
        </div>
        <div className="admin-main-card">
          <div className="admin-card-header">
            <h1>Welcome</h1>
          </div>
          <div className="admin-card-data">
            <div
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "20px",
                width: "60%",
              }}
            >
              <Card
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "20px",
                  width: "100%",
                  height: "320px",
                }}
              >
                <h5>Total PR</h5>

                <div className="pie-card">
                  {isDataLoaded ? (
                    <div className="pie-data">
                      <ReactApexChart
                        options={options}
                        series={pieChartData.map((item) => item.value)}
                        labels={pieChartData.map((item) => item.name)}
                        type="pie"
                        width={380}
                      />
                      <div className="pie-data-label">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#1C304C"
                              d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2"
                            />
                          </svg>
                          Corrections required
                        </div>
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="#0FDCD2"
                              d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2"
                            />
                          </svg>
                          Ready for Publication
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </Card>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "20px",
                width: "35%",
                height: "100%",
              }}
            >
              <Card
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "20px",
                  paddingLeft: "20px",
                  width: "100%",
                  flexDirection: "row",
                  height: "150px",
                  gap: "40px",
                }}
              >
                <div>
                  <img src={contract1} alt="Logo" />
                </div>
                <div>
                  <h5>Total PR</h5>
                  <h5>{publicationReady + correctionRequired}</h5>
                </div>
              </Card>
              <Card
                style={{
                  display: "flex",
                  alignItems: "center",
                  paddingTop: "20px",
                  paddingLeft: "20px",
                  width: "100%",
                  flexDirection: "row",
                  height: "150px",
                  gap: "40px",
                }}
              >
                <div>
                  <img src={contract1} alt="Logo" />
                </div>
                <div>
                  <h5>PR Verified</h5>
                  <h5>{publicationReady}</h5>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
