import React, { useState } from "react";
import { Input, Button, Typography, Space, Tabs } from "antd";
import { FileTextOutlined, SendOutlined } from "@ant-design/icons";
import { postDialogueStream } from "../utils/api";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const { TextArea } = Input;
const { Title } = Typography;

function ContentGenerater() {
  const { baseid } = useParams<{ baseid: string }>();
  const [title, setTitle] = useState("");
  const [outline, setOutline] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");

  const handleGenerateOutline = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setOutline(""); // 清空之前的内容

    try {
      let generatedOutline = "";
      await postDialogueStream(
        `/dialogue/generateOutline`,
        [],
        title.trim(),
        (token) => {
          generatedOutline += token;
          setOutline(generatedOutline);
        }
      );
    } catch (error) {
      console.error("Error generating outline:", error);
      setOutline("生成提纲时发生错误，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!baseid || !outline) return;

    setContentLoading(true);
    setContent(""); // 清空之前的内容

    try {
      // 处理提纲格式，将其转换为一个连续的字符串
      const processedOutline = outline
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line) // 移除空行
        .join(" ");

      let generatedContent = "";
      await postDialogueStream(
        `/dialogue/generateContent/${baseid}`,
        [],
        processedOutline,
        (token) => {
          generatedContent += token;
          setContent(generatedContent);
        }
      );
    } catch (error) {
      console.error("Error generating content:", error);
      setContent("生成内容时发生错误，请稍后重试。");
    } finally {
      setContentLoading(false);
    }
  };

  const handleOutlineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutline(e.target.value);
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>研究报告生成</Title>

      <Space direction="vertical" style={{ width: "100%" }}>
        <Space.Compact style={{ width: "100%", marginBottom: "20px" }}>
          <Input
            placeholder="请输入文章标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onPressEnter={handleGenerateOutline}
            disabled={loading}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleGenerateOutline}
            loading={loading}
          >
            生成提纲
          </Button>
        </Space.Compact>

        <TextArea
          value={outline}
          onChange={handleOutlineChange}
          placeholder="生成的提纲将显示在这里..."
          autoSize={{ minRows: 10, maxRows: 20 }}
          style={{ marginBottom: "20px" }}
        />

        <Button
          type="primary"
          icon={<FileTextOutlined />}
          onClick={handleGenerateContent}
          loading={contentLoading}
          disabled={!outline}
          style={{ marginBottom: "20px" }}
        >
          生成研究报告
        </Button>

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
