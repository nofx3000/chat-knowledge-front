import React from "react";
import { Row, Col } from "antd";
import BaseDetail from "./BaseDetail";
import ContentGenerater from "./ContentGenerater";

function Generator() {
  return (
    <Row style={{ height: "100vh" }}>
      <Col
        span={8}
        style={{ borderRight: "1px solid #f0f0f0", height: "100%" }}
      >
        <BaseDetail />
      </Col>
      <Col span={16} style={{ height: "100%" }}>
        <ContentGenerater />
      </Col>
    </Row>
  );
}

export default Generator;
