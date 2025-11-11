import AgentCard from "./AgentCard";

export default function AgentGrid({ agents = [] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: 12 }}>
      {agents.length === 0 ? (
        <div style={{ color: "#999" }}>No agents in this category.</div>
      ) : (
        agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)
      )}
    </div>
  );
}
