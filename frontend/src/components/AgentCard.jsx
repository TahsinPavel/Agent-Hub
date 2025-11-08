import { useState } from "react";
import { callAgent } from "../api/agentApi";

export default function AgentCard({ agent }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCallAgent = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const data = await callAgent(agent.id, "Hello AI"); // replace with dynamic input if needed
      setResponse(data);
    } catch (err) {
      setError("Agent call failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: 10, width: 250 }}>
      <h3>{agent.name}</h3>
      <p>{agent.description}</p>
      <button onClick={handleCallAgent} disabled={loading}>
        {loading ? "Calling..." : "Call Agent"}
      </button>
      {response && (
        <div style={{ marginTop: 10, background: "#f3f3f3", padding: 5 }}>
          <strong>Response:</strong>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
