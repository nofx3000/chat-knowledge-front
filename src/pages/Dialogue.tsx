import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button, List, Typography, Space } from "antd";
import { SendOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { postDialogue } from "../utils/api";

const { Text } = Typography;
const { TextArea } = Input;

interface Message {
  role: "human" | "ai";
  content: string;
}

function Dialogue() {
  const { baseid } = useParams<{ baseid: string }>();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = { role: "human", content: inputValue };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const chatHistory: [string, string][] = messages.map((msg) => [
        msg.role === "human" ? "Human" : "AI",
        msg.content,
      ]);
      const response = await postDialogue(baseid!, chatHistory, inputValue);

      const aiMessage: Message = { role: "ai", content: response.response };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error in dialogue:", error);
      // 可以在这里添加错误处理，比如显示一个错误消息
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // 返回上一页
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1>知识库对话 (ID: {baseid})</h1>
        <Button icon={<ArrowLeftOutlined />} onClick={handleGoBack}>
          返回
        </Button>
      </Space>
      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        {messages.length === 0 ? (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#bbb",
              fontSize: "18px",
            }}
          >
            请输入问题
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={messages}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Text strong>{item.role === "human" ? "You:" : "AI:"}</Text>
                  }
                  description={item.content}
                />
              </List.Item>
            )}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", marginTop: "auto", marginBottom: "10px" }}>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleKeyPress}
          placeholder="输入您的问题..."
          disabled={loading}
          autoSize={{ minRows: 2, maxRows: 6 }}
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={loading}
          style={{ marginLeft: "10px", height: "auto" }}
        >
          发送
        </Button>
      </div>
    </div>
  );
}

export default Dialogue;
