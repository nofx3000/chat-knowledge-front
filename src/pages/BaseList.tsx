import React, { useEffect, useState } from "react";
import { Layout, Typography, List, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const { Content } = Layout;
const { Title } = Typography;

interface KnowledgeBase {
  id: number;
  name: string;
}

function BaseList() {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKnowledgeBases = async () => {
      try {
        const response = await api.get("/base");
        setKnowledgeBases(response.data);
      } catch (error) {
        console.error("Error fetching knowledge bases:", error);
      }
    };

    fetchKnowledgeBases();
  }, []);

  const handleEnterBase = (baseId: number) => {
    navigate(`/base/${baseId}`);
  };

  return (
    <Layout>
      <Content style={{ padding: "50px" }}>
        <Title level={2}>知识库列表</Title>
        <List
          dataSource={knowledgeBases}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  onClick={() => handleEnterBase(item.id)}
                  key="enter-button"
                >
                  点击进入
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={item.name}
                description={`知识库 ID: ${item.id}`}
              />
            </List.Item>
          )}
        />
      </Content>
    </Layout>
  );
}

export default BaseList;
