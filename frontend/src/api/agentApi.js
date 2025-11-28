import axios from "axios";

// Use relative /api paths so Vite dev server can proxy them to Django.
export const fetchAgents = async () => {
  const response = await axios.get("/api/agents/");
  return response.data;
};

export const callAgent = async (agentIdOrName, payload = {}) => {
  try {
    console.log(`Calling agent ${agentIdOrName} with payload:`, payload);
    const response = await axios.post(`/api/agents/${agentIdOrName}/call/`, payload);
    console.log(`Agent ${agentIdOrName} response:`, response.data);
    return response.data;
  } catch (error) {
    console.error("Agent call failed", error.response || error);
    throw error;
  }
};

export const getAgentDetails = async (agentIdOrName) => {
  try {
    const response = await axios.get(`/api/agents/${agentIdOrName}/details/`);
    return response.data;
  } catch (error) {
    console.error("Failed to get agent details", error.response || error);
    throw error;
  }
};

// Workspace API functions
export const fetchWorkspaces = async () => {
  const response = await axios.get("/api/workspaces/");
  return response.data;
};

export const createWorkspace = async (name) => {
  const response = await axios.post("/api/workspaces/", { name });
  return response.data;
};
