import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUsage } from "../contexts/UsageContext";
import WriterWorkspace from "../components/workspaces/WriterWorkspace";
import CodeWorkspace from "../components/workspaces/CodeWorkspace";
import WorkspaceSelector from "../components/WorkspaceSelector";
import Navbar from "../components/Navbar";

export default function AgentWorkspace() {
  const { agentId } = useParams();
  const { isAuthenticated } = useAuth();
  const { canUseAgent } = useUsage();

  // Check if user can access this agent
  const canUse = canUseAgent(agentId, isAuthenticated);

  if (!canUse && !isAuthenticated) {
    return (
      <>
        <Navbar />
        <div style={{ 
          minHeight: "100vh", 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          paddingTop: '80px' // Add space for fixed navbar
        }}>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: 40,
            textAlign: "center",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
            maxWidth: 400
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h2 style={{ margin: "0 0 16px 0", color: "white" }}>Access Restricted</h2>
            <p style={{ margin: "0 0 24px 0", color: "rgba(255,255,255,0.8)" }}>
              You've reached your free usage limit. Sign up for unlimited access!
            </p>
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                padding: "12px 24px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #646cff 0%, #ff64c8 100%)",
                color: "white",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </>
    );
  }

  // Render workspace selector in top-right corner
  const WorkspaceHeader = () => (
    <div style={{
      position: "fixed",
      top: 20,
      right: 20,
      zIndex: 1000
    }}>
      <WorkspaceSelector />
    </div>
  );

  // Route to appropriate workspace component
  const renderWorkspace = () => {
    switch (agentId) {
      case 'writer':
        return <WriterWorkspace />;
      case 'code-assistant':
        return <CodeWorkspace />;
      case 'chat-bot':
        return <WriterWorkspace />; // Can reuse for chat
      case 'translator':
        return <WriterWorkspace />; // Can reuse for translation
      default:
        return <Navigate to="/marketplace" replace />;
    }
  };

  return (
    <>
      <Navbar />
      <WorkspaceHeader />
      {renderWorkspace()}
    </>
  );
}