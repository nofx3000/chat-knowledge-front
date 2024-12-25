import React, { useState } from "react";
import { Input, Button, Typography, Space } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { postDialogueStream } from "../utils/api";
import { observer } from "mobx-react";
import store from "../mobx/mobx";

const { TextArea } = Input;
const { Title } = Typography;

const Outline: React.FC = observer(() => {
  const [loading, setLoading] = useState(false);

  const handleGenerateOutline = async () => {
    if (!store.outlineValues.title.trim()) return;
    setLoading(true);
    store.setOutlineContent("");

    console.log("Current Prompt Values:", store.promptValues);
    try {
      let generatedOutline = "";
      await postDialogueStream(
        `/dialogue/generateOutline`,
        [],
        {
          title: store.outlineValues.title.trim(),
          contentType: store.promptValues.contentType,
          requirements: store.promptValues.requirements,
        },
        (token) => {
          generatedOutline += token;
          store.setOutlineContent(generatedOutline);
        }
      );
    } catch (error) {
      console.error("Error generating outline:", error);
      store.setOutlineContent("生成提纲时发生错误，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Title level={4} style={{ margin: "0 0 16px 0" }}>
        步骤三：文章提纲生成
      </Title>

      <Space.Compact style={{ width: "100%", marginBottom: "16px" }}>
        <Input
          placeholder="请输入文章标题"
          value={store.outlineValues.title}
          onChange={(e) => store.setOutlineTitle(e.target.value)}
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

      <div style={{ flex: 1, overflow: "auto" }}>
        <TextArea
          value={store.outlineValues.content}
          onChange={(e) => store.setOutlineContent(e.target.value)}
          placeholder="生成的提纲将显示在这里..."
          autoSize
          style={{
            height: "100%",
          }}
        />
      </div>
    </div>
  );
});

export default Outline;
