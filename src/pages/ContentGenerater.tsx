import React, { useState, useMemo } from "react";
import { Input, Typography, Space, Tabs, Button, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { postDialogueStream } from "../utils/api";
import { observer } from "mobx-react";
import store from "../mobx/mobx";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const { TextArea } = Input;
const { Title } = Typography;

const ContentGenerater: React.FC = observer(() => {
  const { baseid } = useParams<{ baseid: string }>();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview");

  const isGenerateDisabled = useMemo(() => {
    return (
      !store.promptValues.contentType.trim() ||
      !store.outlineValues.title.trim() ||
      !store.outlineValues.content.trim()
    );
  }, [
    store.promptValues.contentType,
    store.outlineValues.title,
    store.outlineValues.content,
  ]);

  const handleStop = async () => {
    try {
      await api.get("/dialogue/stop");
      setLoading(false);
      message.success("已停止生成");
    } catch (error) {
      console.error("Error stopping generation:", error);
      message.error("停止生成失败,请稍后重试");
    }
  };

  const handleGenerate = async () => {
    if (!baseid) {
      console.error("No baseid provided");
      return;
    }

    if (isGenerateDisabled) {
      message.error("请输入内容类型、文章标题和提纲！");
      return;
    }

    console.log("Current Store State:", {
      baseid,
      title: store.outlineValues.title.trim(),
      outline: store.outlineValues.content,
      contentType: store.promptValues.contentType,
    });

    setLoading(true);
    setContent("");

    try {
      let generatedContent = "";
      await postDialogueStream(
        `/dialogue/generateContent/${baseid}`,
        [],
        {
          title: store.outlineValues.title.trim(),
          outline: store.outlineValues.content,
          contentType: store.promptValues.contentType,
        },
        (token) => {
          generatedContent += token;
          setContent(generatedContent);
        }
      );
    } catch (error) {
      console.error("Error generating content:", error);
      setContent("生成文章时发生错误，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Title level={4} style={{ marginTop: 0 }}>
        步骤四：文章生成
      </Title>
      <Button
        type={loading ? "primary" : "primary"}
        danger={loading}
        style={{ width: "100%" }}
        onClick={loading ? handleStop : handleGenerate}
        // loading={loading}
        // disabled={!loading && isGenerateDisabled}
      >
        {loading ? <LoadingOutlined /> : null}
        {loading ? "停止生成" : "开始生成"}
      </Button>

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
                    {content.replace(/<think>[\s\S]*?<\/think>/g, '') || "预览内容将显示在这里..."}
                  </ReactMarkdown>
                </div>
              ),
            },
          ]}
        />
      </Space>
    </div>
  );
});

export default ContentGenerater;
