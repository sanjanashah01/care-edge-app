import React, { useState } from "react";
import "../../../assets/style/Dashboard.css";
import Dropzone from "react-dropzone";
import { Card, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import RingLoader from "react-spinners/RingLoader";

export default function FileUploader() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptedFiles = (files) => {
    setSelectedFiles(files);
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedTypes([...selectedTypes, value]);
    } else {
      setSelectedTypes(selectedTypes.filter((item) => item !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = Cookies.get("authToken");
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    formData.append("selectedTypes", selectedTypes);
    formData.append("createdBy", token);
    try {
      await axios.post(
        `${process.env.REACT_APP_BASE_URL}/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      ).then((response) => {
        if (response.status === 201) {
          window.location.href = "/file-preview";
        }
      });
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <p className="navbar-2">PR Check Point</p>
        {isLoading ? (
          <div className="loader">
            <h2 className="section-header-title">Processing your file</h2>
            <RingLoader
              color="rgb(54, 214, 182)"
              loading={isLoading}
              aria-label="Loading Spinner"
              data-testid="loader"
              size={150}
            />
          </div>
        ) : (
          <div className="main-card">
            <div className="container">
              <Dropzone
                accept={{
                  "application/msword": [".doc", ".docx"],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    [".docx"],
                }}
                onDrop={(acceptedFiles) => {
                  handleAcceptedFiles(acceptedFiles);
                }}
                multiple={false}
              >
                {({ getRootProps, getInputProps }) => (
                  <div style={{ textAlign: "center", height: "100%" }}>
                    <div
                      className="dz-message needsclick"
                      {...getRootProps()}
                      style={{ textAlign: "center", height: "92%" }}
                    >
                      <input {...getInputProps()} />
                      <div className="add-file">
                        <svg
                          width="78"
                          height="78"
                          viewBox="0 0 78 78"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15.8438 45.0938H10.9688C10.6455 45.0938 10.3355 45.2222 10.107 45.4507C9.8784 45.6793 9.75 45.9893 9.75 46.3125V63.375C9.75 63.6982 9.8784 64.0082 10.107 64.2368C10.3355 64.4653 10.6455 64.5938 10.9688 64.5938H15.8438C18.4296 64.5938 20.9096 63.5665 22.738 61.738C24.5665 59.9096 25.5938 57.4296 25.5938 54.8438C25.5938 52.2579 24.5665 49.7779 22.738 47.9495C20.9096 46.121 18.4296 45.0938 15.8438 45.0938ZM15.8438 62.1562H12.1875V47.5312H15.8438C17.7831 47.5312 19.6431 48.3017 21.0145 49.673C22.3858 51.0444 23.1562 52.9044 23.1562 54.8438C23.1562 56.7831 22.3858 58.6431 21.0145 60.0145C19.6431 61.3858 17.7831 62.1562 15.8438 62.1562ZM66.6565 60.3281C66.7722 60.4389 66.865 60.5714 66.9295 60.7181C66.994 60.8647 67.0289 61.0226 67.0323 61.1828C67.0357 61.343 67.0075 61.5023 66.9493 61.6515C66.8911 61.8008 66.804 61.9371 66.693 62.0527C65.9569 62.8453 65.0668 63.4794 64.0771 63.9163C63.0875 64.3533 62.0192 64.5838 60.9375 64.5938C56.2331 64.5938 52.4062 60.2184 52.4062 54.8438C52.4062 49.4691 56.2331 45.0938 60.9375 45.0938C62.0197 45.1045 63.0883 45.336 64.0779 45.7739C65.0675 46.2119 65.9574 46.8472 66.693 47.6409C66.8039 47.7566 66.8909 47.8929 66.949 48.0422C67.0071 48.1914 67.0353 48.3506 67.0319 48.5108C67.0285 48.6709 66.9936 48.8288 66.9292 48.9755C66.8648 49.1221 66.7721 49.2546 66.6565 49.3655C66.5409 49.4763 66.4045 49.5633 66.2553 49.6214C66.106 49.6796 65.9468 49.7077 65.7866 49.7043C65.6265 49.701 65.4686 49.6661 65.322 49.6016C65.1753 49.5372 65.0428 49.4445 64.932 49.3289C64.4237 48.773 63.8072 48.3268 63.1203 48.0177C62.4334 47.7086 61.6906 47.5431 60.9375 47.5312C57.5859 47.5312 54.8438 50.8127 54.8438 54.8438C54.8438 58.8748 57.5859 62.1562 60.9375 62.1562C61.6906 62.1444 62.4334 61.9789 63.1203 61.6698C63.8072 61.3607 64.4237 60.9145 64.932 60.3586C65.0431 60.2433 65.1759 60.151 65.3228 60.087C65.4697 60.023 65.6277 59.9887 65.7879 59.9858C65.9481 59.983 66.1072 60.0118 66.2563 60.0705C66.4053 60.1292 66.5413 60.2168 66.6565 60.3281ZM39 45.0938C34.2956 45.0938 30.4688 49.4691 30.4688 54.8438C30.4688 60.2184 34.2956 64.5938 39 64.5938C43.7044 64.5938 47.5312 60.2184 47.5312 54.8438C47.5312 49.4691 43.7044 45.0938 39 45.0938ZM39 62.1562C35.6484 62.1562 32.9062 58.8748 32.9062 54.8438C32.9062 50.8127 35.6484 47.5312 39 47.5312C42.3516 47.5312 45.0938 50.8127 45.0938 54.8438C45.0938 58.8748 42.3516 62.1562 39 62.1562ZM14.625 35.3438C14.9482 35.3438 15.2582 35.2153 15.4868 34.9868C15.7153 34.7582 15.8438 34.4482 15.8438 34.125V12.1875C15.8438 11.8643 15.9722 11.5543 16.2007 11.3257C16.4293 11.0972 16.7393 10.9688 17.0625 10.9688H45.0938V26.8125C45.0938 27.1357 45.2222 27.4457 45.4507 27.6743C45.6793 27.9028 45.9893 28.0312 46.3125 28.0312H62.1562V34.125C62.1562 34.4482 62.2847 34.7582 62.5132 34.9868C62.7418 35.2153 63.0518 35.3438 63.375 35.3438C63.6982 35.3438 64.0082 35.2153 64.2368 34.9868C64.4653 34.7582 64.5938 34.4482 64.5938 34.125V26.8125C64.5939 26.6524 64.5625 26.4939 64.5013 26.3459C64.4401 26.198 64.3504 26.0635 64.2373 25.9502L47.1748 8.88773C47.0615 8.77459 46.927 8.68488 46.7791 8.62371C46.6311 8.56254 46.4726 8.53112 46.3125 8.53125H17.0625C16.0928 8.53125 15.1628 8.91646 14.4771 9.60214C13.7915 10.2878 13.4062 11.2178 13.4062 12.1875V34.125C13.4062 34.4482 13.5347 34.7582 13.7632 34.9868C13.9918 35.2153 14.3018 35.3438 14.625 35.3438ZM47.5312 12.6902L60.4317 25.5938H47.5312V12.6902Z"
                            fill="#0FDCD2"
                          />
                        </svg>
                        <div>
                          <span className="dropzone-text">
                            Drop your word file here or click to upload your
                            word file.
                          </span>
                          <span className="dropzone-text2">
                            Total file size may not exceed 25 MB.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Dropzone>
              {selectedFiles.map((file, index) => (
                <Card
                  key={index}
                  className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                >
                  <div className="p-2">
                    <Row className="align-items-center">
                      <Col>
                        <Link to="#" className="text-muted font-weight-bold">
                          {file.name}
                        </Link>
                        <p className="mb-0">
                          <strong>{file.formattedSize}</strong>
                        </p>
                      </Col>
                    </Row>
                  </div>
                </Card>
              ))}
            </div>
            <div className="container">
              <div className="card1">
                <h5 className="mb-4">Type of PR</h5>
                <Form className="vertical-card">
                  <div className="data-card">
                    <div className="sub-data-card">
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="Normal PR"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          Normal PR
                        </Label>
                      </FormGroup>
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="Provisional Rating"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          Provisional Rating
                        </Label>
                      </FormGroup>
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="INC - Review with INC"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          INC - Review with INC
                        </Label>
                      </FormGroup>
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="Securitisation - Provisional"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          Securitisation - Provisional
                        </Label>
                      </FormGroup>
                    </div>
                  </div>
                  <div className="data-card">
                    <div className="sub-data-card">
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="CPTI"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          CPTI
                        </Label>
                      </FormGroup>
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="CE Ratings"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          CE Ratings
                        </Label>
                      </FormGroup>
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="Withdrawal - No Dues"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          Withdrawal - No Dues
                        </Label>
                      </FormGroup>
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="Securitisation - Provisional to Final"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          Securitisation - Provisional to Final
                        </Label>
                      </FormGroup>
                    </div>
                  </div>
                  <div className="data-card">
                    <div className="sub-data-card">
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="INC - First Time"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          INC - First Time
                        </Label>
                      </FormGroup>
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="Withdrawal - NOC"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          Withdrawal - NOC
                        </Label>
                      </FormGroup>
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="Securitisation - Normal"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          Securitisation - Normal
                        </Label>
                      </FormGroup>
                      <FormGroup className="form-group" check>
                        <Input
                          type="checkbox"
                          value="Securitisation - Withdrawal"
                          onChange={handleCheckboxChange}
                        />
                        <Label className="form-group-label" check>
                          Securitisation - Withdrawal
                        </Label>
                      </FormGroup>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: "80%",
                justifyContent: "flex-end",
                paddingBottom: "40px",
              }}
            >
              <button
                className="submit-button"
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
