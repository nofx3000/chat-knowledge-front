import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Input,
  message,
  Card,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import api, { createBase } from "../utils/api";

const { Content } = Layout;
const { Title } = Typography;

interface KnowledgeBase {
  id: number;
  name: string;
}

function BaseList() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newBaseName, setNewBaseName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchKnowledgeBases();
  }, []);

  const fetchKnowledgeBases = async () => {
    try {
      const response = await api.get("/base");
      setKnowledgeBases(response.data);
    } catch (error) {
      console.error("Error fetching knowledge bases:", error);
      message.error("获取知识库列表失败");
    }
  };

  const handleEnterBase = (baseId: number) => {
    navigate(`/generator/${baseId}`);
  };

  const handleCreateBase = async () => {
    if (!newBaseName.trim()) {
      message.error("知识库名称不能为空");
      return;
    }
    try {
      await createBase(newBaseName);
      message.success("知识库创建成功");
      setIsCreating(false);
      setNewBaseName("");
      fetchKnowledgeBases();
    } catch (error) {
      console.error("Error creating base:", error);
      message.error("创建知识库失败");
    }
  };

  return (
    <Layout>
      <Content style={{ padding: "50px", height: "100vh" }}>
        <Title level={2} style={{ marginBottom: "20px" }}>
          知识库列表
        </Title>
        <Button
          onClick={() => setIsCreating(true)}
          style={{ marginBottom: "20px" }}
        >
          新建知识库
        </Button>
        {isCreating && (
          <div style={{ marginBottom: "20px" }}>
            <Input
              placeholder="输入知识库名称"
              value={newBaseName}
              onChange={(e) => setNewBaseName(e.target.value)}
              style={{ width: "200px", marginRight: "10px" }}
            />
            <Button onClick={handleCreateBase} type="primary">
              添加
            </Button>
            <Button
              onClick={() => setIsCreating(false)}
              style={{ marginLeft: "10px" }}
            >
              取消
            </Button>
          </div>
        )}
        <Row gutter={[16, 16]}>
          {knowledgeBases.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
              <Card
                hoverable
                style={{
                  width: "100%",
                  height: 300,
                  borderRadius: 10,
                  backgroundImage: "url(book-background.png)", // 请确保有这个图片
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backgroundBlendMode: "overlay",
                }}
                onClick={() => handleEnterBase(item.id)}
              >
                <Card.Meta
                  title={item.name}
                  description={`知识库 ID: ${item.id}`}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Content>
    </Layout>
  );
}

export default BaseList;
