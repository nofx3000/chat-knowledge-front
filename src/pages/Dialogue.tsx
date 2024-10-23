import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button, List, Typography, Space } from "antd";
import { SendOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { postDialogueStream } from "../utils/api";

const { Text } = Typography;
const { TextArea } = Input;

// 定义消息的接口，包含角色和内容
interface Message {
  role: "human" | "ai";
  content: string;
}

function Dialogue() {
  // 使用 React Router 的 hooks 获取 URL 参数和导航功能
  const { baseid } = useParams<{ baseid: string }>();
  const navigate = useNavigate();

  // 状态管理
  const [messages, setMessages] = useState<Message[]>([]); // 存储对话历史
  const [inputValue, setInputValue] = useState(""); // 用户输入
  const [loading, setLoading] = useState(false); // 加载状态

  // 用于自动滚动到最新消息
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // 自动滚动函数
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 每当消息更新时，自动滚动到底部
  useEffect(scrollToBottom, [messages]);

  // 处理发送消息的函数
  const handleSend = async () => {
    if (!inputValue.trim()) return; // 如果输入为空，不执行任何操作

    // 创建新的用户消息并添加到消息列表
    const newMessage: Message = { role: "human", content: inputValue };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue(""); // 清空输入框
    setLoading(true); // 设置加载状态

    try {
      // 将消息历史转换为适合 API 的格式
      const chatHistory: [string, string][] = messages.map((msg) => [
        msg.role === "human" ? "Human" : "AI",
        msg.content,
      ]);

      let aiResponse = ""; // 用于累积 AI 的响应
      // 调用流式对话 API
      await postDialogueStream(baseid!, chatHistory, inputValue, (token) => {
        aiResponse += token; // 累积接收到的 token
        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "ai") {
            // 如果最后一条消息是 AI 的，更新其内容
            // 如果只是单纯的lastMessage.content += token会出现重复拼接的问题
            lastMessage.content = aiResponse;
          } else {
            // 这一步是把生成的内容添加到历史记录
            newMessages.push({ role: "ai", content: aiResponse });
          }
          return newMessages;
        });
      });
    } catch (error) {
      console.error("Error in dialogue:", error);
      // 如果发生错误，添加一条错误消息
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "抱歉，发生了错误。请稍后再试。" },
      ]);
    } finally {
      setLoading(false); // 无论成功与否，都结束加载状态
    }
  };

  // 处理返回上一页的函数
  const handleGoBack = () => {
    navigate(-1); // 使用 React Router 的 navigate 函数返回上一页
  };

  // 处理按键事件，允许使用 Enter 发送消息
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 组件的 JSX 结构
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
          // 如果没有消息，显示提示文本
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
          // 否则，显示消息列表
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
        <div ref={messagesEndRef} /> {/* 用于自动滚动的空 div */}
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
