import React, { useState } from "react";
import { Input, Typography, Space, Tabs } from "antd";
import ReactMarkdown from "react-markdown";

const { TextArea } = Input;
const { Title } = Typography;

function ContentGenerater() {
  const [content, setContent] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>研究报告生成</Title>

      <Space direction="vertical" style={{ width: "100%" }}>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as "edit" | "preview")}
          items={[
            {
              key: "edit",
              label: "编辑",
              children: (
                <TextArea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="生成的研究报告将显示在这里..."
                  autoSize={{ minRows: 20, maxRows: 50 }}
                />
              ),
            },
            {
              key: "preview",
              label: "预览",
              children: (
                <div
                  style={{
                    padding: "16px",
                    border: "1px solid #d9d9d9",
                    borderRadius: "4px",
                    minHeight: "500px",
                    backgroundColor: "#fff",
                    overflow: "auto",
                  }}
                >
                  <ReactMarkdown>
                    {content || "预览内容将显示在这里..."}
                  </ReactMarkdown>
                </div>
              ),
            },
          ]}
        />
      </Space>
    </div>
  );
}

export default ContentGenerater;
