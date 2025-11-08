import { useEffect, useState } from "react";
import { fetchAgents } from "../api/agentApi";
import AgentCard from "../components/AgentCard";

export default function Marketplace() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const data = await fetchAgents();
        setAgents(data);
      } catch (err) {
        setError("Failed to load agents.");
      } finally {
        setLoading(false);
      }
    };
    loadAgents();
  }, []);

  if (loading) return <p>Loading agents...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>🤖 AI Agent Marketplace</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}
