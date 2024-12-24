import React, { useState } from "react";
import { Input, Button, Typography, Space } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { postDialogueStream } from "../utils/api";
import { observer } from 'mobx-react';
import store from '../mobx/mobx';

const { TextArea } = Input;
const { Title } = Typography;

const Outline: React.FC = observer(() => {
  const [title, setTitle] = useState("");
  const [outline, setOutline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateOutline = async () => {
    console.log("title");
    
    console.log('Current Prompt Values:', store.promptValues);
    return;
    if (!title.trim()) return;
    setLoading(true);
    setOutline("");

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

  const handleOutlineChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOutline(e.target.value);
  };

  return (
    <div style={{ padding: "20px", flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Title level={4} style={{ margin: '0 0 16px 0' }}>文章提纲生成</Title>

      <Space.Compact style={{ width: "100%", marginBottom: "16px" }}>
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
        autoSize={{ minRows: 6, maxRows: 12 }}
        style={{ flex: 1 }}
      />
    </div>
  );
});

export default Outline;
