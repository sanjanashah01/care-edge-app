import React from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
} from "reactstrap";

export default function AddEditLogs() {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>AddEditLogs</CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
