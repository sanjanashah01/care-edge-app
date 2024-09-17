import React, { useEffect, useState, useRef } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
  UncontrolledAlert,
} from "reactstrap";
import Select from "react-select";
import Cookies from "js-cookie";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import statesData from "../../state_name.json";
import citiesData from "../../city_name.json";
import { isFetching } from "../../helpers/utilityFunctions";

export default function AddEditUser() {
  const { id } = useParams();
  const isFetchingRef = useRef(false);
  const [showToast, setShowToast] = useState(false);
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    const stateOptions = statesData.state.map((state) => ({
      value: state.stateKey,
      label: state.stateKey,
    }));
    setStateOptions(stateOptions);
  }, []);
  useEffect(() => {
    if (id && !isFetchingRef.current) {
      isFetching(isFetchingRef);
      fetchUserDetails();
    }
  }, [id]);

  useEffect(() => {
    if (userDetails.state) {
      const stateOption = stateOptions.find(
        (option) => option.value === userDetails.state
      );
      setSelectedState(stateOption);

      if (stateOption) {
        const filteredCities = citiesData.cityname
          .filter((city) => city.stateKey === stateOption.value)
          .map((city) => ({
            value: city.city,
            label: city.city,
          }));
        setCityOptions(filteredCities);

        const cityOption = filteredCities.find(
          (option) => option.value === userDetails.city
        );
        setSelectedCity(cityOption);
      }
    }
  }, [userDetails, stateOptions]);

  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    validation.setFieldValue(
      "state",
      selectedOption ? selectedOption.value : ""
    );
  };

  const handleCityChange = (selectedOption) => {
    setSelectedCity(selectedOption);
    validation.setFieldValue(
      "city",
      selectedOption ? selectedOption.value : ""
    );
  };

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      name: userDetails.userName || "",
      email: userDetails.email || "",
      password: "",
      orgName: userDetails.orgName || "",
      city: userDetails.city || "",
      state: userDetails.state || "",
      contactNumber: userDetails.contactNumber || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      orgName: Yup.string().required("Organization is required"),
      contactNumber: Yup.string()
        .required("Please enter phone")
        .test(
          "len",
          "Contact number must be 10 digits",
          (val) => val && val.toString().length === 10
        ),
      email: Yup.string()
        .email("Email is invalid")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
      city: Yup.string().required("Please enter city"),
      state: Yup.string().required("Please enter state"),
    }),
    // onSubmit: (values) => {
    //   handleAddUser(values);
    // },
    onSubmit: (values) => {
      if (id) {
        updateUser(values);
      } else {
        handleAddUser(values);
      }
    },
  });

  const handleAddUser = async (values) => {
    try {
      const form = {
        userName: values.name,
        email: values.email,
        password: values.password,
        state: selectedState.value,
        city: selectedCity.value,
        contactNumber: values.contactNumber,
        orgName: values.orgName,
      };
      const token = Cookies.get("authToken");
      await axios.post(`${process.env.REACT_APP_BASE_URL}/users/signup`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging the user", error);
      if (error.response.data.message) {
        setShowToast(true);
        setToastMessage(error.response.data.message);
      }
      setShowToast(true);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserDetails(response.data);
      const userState = response.data.state;
      const userCity = response.data.city;

      if (userState) {
        const stateOption = stateOptions.find(
          (option) => option.value === userState
        );
        setSelectedState(stateOption);

        if (stateOption) {
          const filteredCities = citiesData.cityname
            .filter((city) => city.stateKey === stateOption.value)
            .map((city) => ({
              value: city.city,
              label: city.city,
            }));
          setCityOptions(filteredCities);

          const cityOption = filteredCities.find(
            (option) => option.value === userCity
          );
          setSelectedCity(cityOption);
        }
      }
    } catch (error) {
      console.error(error);
      setToastMessage("Error occurred fetching camera details.");
    }
  };

  const updateUser = async (values) => {
    try {
      const token = Cookies.get("authToken");
      await axios.put(`${process.env.REACT_APP_BASE_URL}/users/${id}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setToastMessage("Error updating camera.");
    }
  };

  useEffect(() => {
    let timer;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Menu" breadcrumbItem={"Add User"} />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <Form
                    className="needs-validation"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >
                    <Row>
                      <Col>
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom01">Name</Label>
                          <Input
                            placeholder="Ex : John Doe"
                            name="name"
                            type="text"
                            id="validationCustom01"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.name}
                            invalid={
                              validation.touched.name && validation.errors.name
                                ? true
                                : false
                            }
                          />
                          {validation.touched.name && validation.errors.name ? (
                            <FormFeedback type="invalid">
                              {validation.errors.name}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom02">Phone</Label>
                          <Input
                            name="contactNumber"
                            placeholder="Ex: 0987654321"
                            type="number"
                            className="form-control"
                            id="validationCustom02"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.contactNumber}
                            invalid={
                              validation.touched.contactNumber &&
                              validation.errors.contactNumber
                                ? true
                                : false
                            }
                          />
                          {validation.touched.contactNumber &&
                          validation.errors.contactNumber ? (
                            <FormFeedback type="invalid">
                              {validation.errors.contactNumber}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom03">
                            Organization
                          </Label>
                          <Input
                            placeholder="Camsense"
                            name="orgName"
                            type="text"
                            id="validationCustom03"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.orgName}
                            invalid={
                              validation.touched.orgName &&
                              validation.errors.orgName
                                ? true
                                : false
                            }
                          />
                          {validation.touched.orgName &&
                          validation.errors.orgName ? (
                            <FormFeedback type="invalid">
                              {validation.errors.orgName}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom04">Email</Label>
                          <Input
                            placeholder="Ex: abc@gmail.com"
                            name="email"
                            type="text"
                            id="validationCustom04"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom05">Password</Label>
                          <Input
                            placeholder=""
                            type="password"
                            name="password"
                            id="validationCustom05"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                          />
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom06">State</Label>
                          <Select
                            name="states"
                            options={stateOptions}
                            classNamePrefix="select"
                            onChange={handleStateChange}
                            value={selectedState}
                            className={
                              validation.touched.state &&
                              validation.errors.state
                                ? "is-invalid"
                                : ""
                            }
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                maxHeight: "135px",
                                overflowY: "auto",
                              }),
                              menuList: (provided) => ({
                                ...provided,
                                maxHeight: "135px",
                                overflowY: "auto",
                              }),
                            }}
                          />
                          {validation.touched.state &&
                          validation.errors.state ? (
                            <div className="invalid-feedback d-block">
                              {validation.errors.state}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup className="mb-3">
                          <Label htmlFor="validationCustom07">City</Label>
                          <Select
                            name="cities"
                            options={cityOptions}
                            classNamePrefix="select"
                            onChange={handleCityChange}
                            value={selectedCity}
                            isDisabled={!selectedState}
                            className={
                              validation.touched.city && validation.errors.city
                                ? "is-invalid"
                                : ""
                            }
                            styles={{
                              menu: (provided) => ({
                                ...provided,
                                maxHeight: "135px",
                                overflowY: "auto",
                              }),
                              menuList: (provided) => ({
                                ...provided,
                                maxHeight: "135px",
                                overflowY: "auto",
                              }),
                            }}
                          />
                          {validation.touched.city && validation.errors.city ? (
                            <div className="invalid-feedback d-block">
                              {validation.errors.city}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Button type="submit" color="primary">
                      <i className="bx bx-plus "></i> Add User
                    </Button>
                    <a href="/">
                      <Button type="button" color="link">
                        <i className="bx bx-arrow-back"></i> Back
                      </Button>
                    </a>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        {showToast === true ? (
          <div
            className="position-fixed top-0 end-0 p-3"
            style={{ zIndex: "1005" }}
          >
            <UncontrolledAlert
              color="light"
              role="alert"
              className="card border mt-4 mt-lg-0 p-0 mb-0"
            >
              <div className="card-header bg-danger-subtle">
                <div className="d-flex">
                  <div className="flex-grow-1">
                    <h5 className="font-size-16 text-danger my-1">Oops!</h5>
                  </div>
                  <div className="flex-shrink-0"></div>
                </div>
              </div>
              <CardBody>
                <div className="text-center">
                  <p className="mb-0">Oops! {toastMessage}</p>
                </div>
              </CardBody>
            </UncontrolledAlert>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
}
