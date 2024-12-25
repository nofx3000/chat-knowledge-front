import axios from "axios";

export const API_BASE_URL = "http://localhost:3001";

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

export const createBase = async (baseName: string) => {
  try {
    const response = await api.post("/base", { base_name: baseName });
    return response.data;
  } catch (error) {
    console.error("Error creating base:", error);
    throw error;
  }
};

export const postDialogueStream = async (
  url: string,
  chatHistory: [string, string][],
  payload: string | Record<string, any>,
  onChunk: (chunk: string) => void
) => {
  try {
    const start_time = Date.now();
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({
        chat_history: chatHistory,
        payload: typeof payload === "string" ? payload : { ...payload },
      }),
    });
    console.log("请求时间为", (Date.now() - start_time) / 1000, "秒");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");
      lines.forEach((line) => {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") {
            return;
          }
          try {
            const parsed = JSON.parse(data);
            onChunk(parsed.token);
          } catch (e) {
            console.error("Error parsing SSE data", e);
          }
        }
      });
    }
  } catch (error) {
    console.error("Error in postDialogueStream:", error);
    throw error;
  }
};

export default api;
