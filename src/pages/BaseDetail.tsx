import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBaseWithDocuments } from "../utils/api";
import FileUpload from "../components/FileUpload"; // 导入 FileUpload 组件
import { Button, Typography } from "antd"; // 导入 Button 组件
import { HomeOutlined } from "@ant-design/icons";
const { Title } = Typography;

interface Base {
  id: number;
  name: string;
  documents: Document[];
}

interface Document {
  id: number;
  title: string;
  filePath: string;
}

function BaseDetail() {
  const { baseid } = useParams<{ baseid: string }>();
  const navigate = useNavigate(); // 使用 useNavigate hook
  const [base, setBase] = useState<Base | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBaseDetails = async () => {
    try {
      const data = await getBaseWithDocuments(baseid!);
      setBase(data);
    } catch (err) {
      setError("Failed to fetch base details. Please try again later.");
      console.error("Error fetching base details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaseDetails();
  }, [baseid]);

  const handleDialogueClick = () => {
    navigate(`/dialogue/${baseid}`);
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleUploadSuccess = () => {
    fetchBaseDetails(); // 刷新资料列表
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      {" "}
      {/* 添加 20px 的内边距 */}
      {base && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <h1 style={{ margin: 0 }}>资料库：</h1>
            <h1 style={{ margin: 0 }}>{base.name}</h1>
            {/* <Button type="primary" onClick={handleDialogueClick}>
                与资料库进行对话
              </Button> */}
            <Button icon={<HomeOutlined />} onClick={handleGoHome}>
              首页
            </Button>
          </div>
          <Title level={4} style={{ margin: "0 0 16px 0" }}>
            步骤一：上传参考文档
          </Title>
          {base.documents && base.documents.length > 0 ? (
            <ul style={{ padding: 0 }}>
              {base.documents.map((doc) => (
                <li key={doc.id}>{doc.title}</li>
              ))}
            </ul>
          ) : (
            <p>尚未上传资料。</p>
          )}
          <FileUpload baseId={baseid!} onUploadSuccess={handleUploadSuccess} />
        </>
      )}
    </div>
  );
}

export default BaseDetail;
