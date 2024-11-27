import React, { useState } from "react";
import { Input, Button, Typography, Space } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { postDialogueStream } from "../utils/api";

const { TextArea } = Input;
const { Title } = Typography;

function Outline() {
  const [title, setTitle] = useState("");
  const [outline, setOutline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateOutline = async () => {
    if (!title.trim()) return;

    setLoading(true);
    setOutline(""); // 清空之前的内容

    try {
      let generatedOutline = "";
      await postDialogueStream(
        `/dialogue/generateOutline`,
        [], // 空的对话历史
        title.trim(), // 使用标题作为输入
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

  const handleOutlineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutline(e.target.value);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Title level={2}>文章提纲生成</Title>

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
        autoSize={{ minRows: 20, maxRows: 50 }}
        style={{ marginBottom: "20px" }}
      />
    </div>
  );
}

export default Outline;
