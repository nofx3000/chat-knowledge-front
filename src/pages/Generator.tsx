import React from "react";
import { Row, Col } from "antd";
import BaseDetail from "./BaseDetail";
import ContentGenerater from "./ContentGenerater";
import Prompt from "./Prompt";
import Outline from "./Outline";

function Generator() {
  return (
    <Row style={{ height: "100vh" }}>
      <Col
        span={8}
        style={{ borderRight: "1px solid #f0f0f0", height: "100%", display: "flex", flexDirection: "column" }}
      >
        <div style={{ flex: "0 0 auto" }}>
          <BaseDetail />
        </div>
        <div style={{ flex: "1 1 auto", overflow: "auto", display: "flex", flexDirection: "column" }}>
          <Prompt />
          <Outline />
        </div>
      </Col>
      <Col span={16} style={{ height: "100%" }}>
        <ContentGenerater />
      </Col>
    </Row>
  );
}

export default Generator;
