import React from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

interface FileUploadProps {
  baseId: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ baseId }) => {
  const props = {
    name: "files",
    multiple: true,
    action: `http://localhost:3001/base/${baseId}/books`, // 使用传入的 baseId
    accept: ".txt,.pdf,.docx,.doc",
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} 文件上传成功。`);
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
      <p className="ant-upload-hint">
        支持单个或批量上传。严禁上传公司数据或其他敏感文件。
      </p>
    </Dragger>
  );
};

export default FileUpload;
