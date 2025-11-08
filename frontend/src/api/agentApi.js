import axios from "axios";

// Use relative /api paths so Vite dev server can proxy them to Django.
export const fetchAgents = async () => {
  const response = await axios.get("/api/agents/");
  return response.data;
};

export const callAgent = async (agentId) => {
  try {
    const response = await axios.post(`/api/agents/${agentId}/call/`);
    return response.data;
  } catch (error) {
    console.error("Agent call failed", error.response || error);
    throw error;
  }
};
