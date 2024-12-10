import React from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { API_BASE_URL as base_url } from "../utils/api";

const { Dragger } = Upload;

interface FileUploadProps {
  baseId: string;
  onUploadSuccess: () => void; // 新增的回调函数
}

const FileUpload: React.FC<FileUploadProps> = ({ baseId, onUploadSuccess }) => {
  const props = {
    name: "files",
    multiple: true,
    action: `${base_url}/base/${baseId}/books`, // 使用传入的 baseId
    accept: ".txt,.pdf,.docx,.doc",
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} 文件上传成功。`);
        onUploadSuccess(); // 调用回调函数
      } else if (status === "error") {
        message.error(`${info.file.name} 文件上传失败。`);
      }
    },
    onDrop(e: React.DragEvent<HTMLDivElement>) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
      <p className="ant-upload-hint">支持单个或批量上传。</p>
    </Dragger>
  );
};

export default FileUpload;
