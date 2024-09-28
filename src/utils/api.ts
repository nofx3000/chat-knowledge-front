import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getBaseWithDocuments = async (baseId: string) => {
  try {
    const response = await api.get(`/base/${baseId}`);
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching base details:", error);
    throw error;
  }
};

export const postDialogue = async (
  baseId: string,
  chatHistory: [string, string][],
  question: string
) => {
  try {
    const response = await api.post(`/dialogue/${baseId}`, {
      chat_history: chatHistory,
      question: question,
    });
    return response.data;
  } catch (error) {
    console.error("Error posting dialogue:", error);
    throw error;
  }
};

// 可以添加其他 API 调用函数

export default api;
