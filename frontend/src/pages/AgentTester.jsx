import { useState, useEffect } from "react";
import { fetchAgents, callAgent } from "../api/agentApi";
import { useAuth } from "../contexts/AuthContext";
import { useUsage } from "../contexts/UsageContext";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AgentTester() {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [payload, setPayload] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { canUseAgent, incrementUsage, getRemainingUses } = useUsage();

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const data = await fetchAgents();
        setAgents(data);
        
        // Check if agent is specified in URL
        const agentParam = searchParams.get('agent');
        let agentToSelect = null;
        
        if (agentParam && data.length > 0) {
          agentToSelect = data.find(a => a.id === agentParam) || data[0];
        } else if (data.length > 0) {
          agentToSelect = data[0];
        }
        
        if (agentToSelect) {
          setSelectedAgent(agentToSelect);
          setPayload(getDefaultPayload(agentToSelect.id));
        }
      } catch (err) {
        setError("Failed to load agents");
      }
    };
    loadAgents();
  }, [searchParams]);

  const getDefaultPayload = (agentId) => {
    const payloads = {
      'writer': JSON.stringify({
        prompt: "",
        max_tokens: 500,
        temperature: 0.8,
        system_message: "You are a creative writing assistant."
      }, null, 2),
      'code-assistant': JSON.stringify({
        task: "",
        language: "python",
        max_tokens: 1000,
        temperature: 0.1
      }, null, 2),
      'image-generator': JSON.stringify({
        prompt: "",
        size: "1024x1024",
        quality: "standard"
      }, null, 2),
      'voice-assistant': JSON.stringify({
        task_type: "text_to_speech",
        text: "",
        voice: "alloy"
      }, null, 2),
      'chat-bot': JSON.stringify({
        prompt: "",
        system_message: "You are a helpful AI assistant"
      }, null, 2),
      'translator': JSON.stringify({
        prompt: "",
        system_message: "You are a professional translator"
      }, null, 2)
    };
    return payloads[agentId] || JSON.stringify({ prompt: "" }, null, 2);
  };

  const getPlaceholderText = (agentId) => {
    const placeholders = {
      'writer': 'Enter your writing request...\n\nExample:\n{\n  "prompt": "Write a short story about a robot discovering emotions",\n  "max_tokens": 500,\n  "temperature": 0.8\n}',
      'code-assistant': 'Enter your coding task...\n\nExample:\n{\n  "task": "Create a Python function to calculate fibonacci numbers",\n  "language": "python",\n  "max_tokens": 1000\n}',
      'image-generator': 'Enter your image description...\n\nExample:\n{\n  "prompt": "A futuristic city at sunset, cyberpunk style",\n  "size": "1024x1024",\n  "quality": "standard"\n}',
      'voice-assistant': 'Enter text for speech synthesis...\n\nExample:\n{\n  "task_type": "text_to_speech",\n  "text": "Hello, welcome to our AI platform!",\n  "voice": "alloy"\n}',
      'chat-bot': 'Enter your question or conversation...\n\nExample:\n{\n  "prompt": "What are the benefits of renewable energy?",\n  "system_message": "You are a knowledgeable assistant"\n}',
      'translator': 'Enter translation request...\n\nExample:\n{\n  "prompt": "Translate to Spanish: How are you today?",\n  "system_message": "You are a professional translator"\n}'
    };
    return placeholders[agentId] || 'Enter JSON payload...';
  };

  const handleAgentChange = (agent) => {
    setSelectedAgent(agent);
    setPayload(getDefaultPayload(agent.id));
    setResponse(null);
    setError(null);
  };

  const handleTest = async () => {
    if (!selectedAgent) return;
    
    // Check usage limits for non-authenticated users
    if (!canUseAgent(selectedAgent.id, isAuthenticated)) {
      setShowLimitModal(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const parsedPayload = JSON.parse(payload);
      const result = await callAgent(selectedAgent.id, parsedPayload);
      setResponse(result);
      
      // Increment usage count only after successful call
      if (!isAuthenticated) {
        incrementUsage(selectedAgent.id);
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError("Invalid JSON payload");
      } else {
        setError(err.response?.data?.error || err.message || "Agent call failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const remainingUses = selectedAgent ? getRemainingUses(selectedAgent.id, isAuthenticated) : 0;
  const canUse = selectedAgent ? canUseAgent(selectedAgent.id, isAuthenticated) : false;

  return (
    <div style={{ 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
      padding: 0,
      paddingTop: '80px' // Add space for fixed navbar
    }}>
      <Navbar />
      <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
        <h2 style={{ marginBottom: 30, color: "white" }}>🧪 Agent Tester</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30 }}>
          {/* Left Panel - Input */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, color: "#ccc" }}>
                Select Agent:
              </label>
              <select
                value={selectedAgent?.id || ''}
                onChange={(e) => {
                  const agent = agents.find(a => a.id === e.target.value);
                  handleAgentChange(agent);
                }}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: 14
                }}
              >
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} ({agent.id})
                  </option>
                ))}
              </select>
            </div>

            {selectedAgent && (
              <div style={{ 
                padding: 16, 
                background: "rgba(255,255,255,0.05)", 
                borderRadius: 8, 
                marginBottom: 20,
                border: "1px solid rgba(255,255,255,0.1)"
              }}>
                <h4 style={{ margin: "0 0 8px 0", color: "white" }}>
                  {selectedAgent.icon} {selectedAgent.name}
                </h4>
                <p style={{ margin: "0 0 8px 0", color: "#ccc", fontSize: 14 }}>
                  {selectedAgent.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ 
                    fontSize: 12, 
                    color: "#999",
                    background: "rgba(100,108,255,0.2)",
                    padding: "2px 8px",
                    borderRadius: 12
                  }}>
                    {selectedAgent.category}
                  </span>
                  {!isAuthenticated && (
                    <span style={{ 
                      fontSize: 12, 
                      color: canUse ? "#22c55e" : "#ef4444",
                      background: canUse ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      padding: "2px 8px",
                      borderRadius: 12
                    }}>
                      {canUse ? `${remainingUses} tests left` : "Limit reached"}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, color: "#ccc" }}>
                Payload (JSON):
              </label>
              <textarea
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                style={{
                  width: "100%",
                  height: 200,
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: 12,
                  fontFamily: "monospace",
                  resize: "vertical"
                }}
                placeholder={selectedAgent ? getPlaceholderText(selectedAgent.id) : "Select an agent first..."}
              />
            </div>

            <button
              onClick={handleTest}
              disabled={loading || !selectedAgent || !canUse}
              style={{
                width: "100%",
                padding: "12px 20px",
                borderRadius: 8,
                border: "none",
                background: loading ? "#555" : canUse ? "linear-gradient(135deg, #646cff 0%, #ff64c8 100%)" : "#666",
                color: "#fff",
                cursor: loading ? "not-allowed" : canUse ? "pointer" : "not-allowed",
                fontSize: 16,
                fontWeight: 600,
                transition: "all 0.2s ease"
              }}
            >
              {loading ? "🤖 Testing..." : canUse ? "🚀 Test Agent" : "Sign up to continue"}
            </button>
          </div>

          {/* Right Panel - Output */}
          <div>
            <h3 style={{ marginBottom: 16, color: "white" }}>Response:</h3>
            
            <div style={{
              minHeight: 400,
              padding: 16,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "monospace",
              fontSize: 12,
              color: "#ccc",
              overflow: "auto"
            }}>
              {loading && (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>🤖</div>
                  <p>AI is processing your request...</p>
                </div>
              )}

              {error && (
                <div style={{ color: "#ff6b6b", padding: 12, background: "rgba(255,107,107,0.1)", borderRadius: 8 }}>
                  <strong>Error:</strong> {error}
                </div>
              )}

              {response && (
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {JSON.stringify(response, null, 2)}
                </pre>
              )}

              {!loading && !error && !response && (
                <div style={{ color: "#666", fontStyle: "italic" }}>
                  Select an agent and click "Test Agent" to see the response here...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Limit Reached Modal */}
        {showLimitModal && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 20
          }}>
            <div style={{
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
              borderRadius: 16,
              padding: 32,
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.1)"
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <h3 style={{ margin: "0 0 16px 0", color: "white" }}>
                Free Tests Used Up!
              </h3>
              <p style={{ margin: "0 0 24px 0", color: "#ccc", lineHeight: 1.5 }}>
                You've used all 3 free tests for <strong>{selectedAgent?.name}</strong>. 
                Sign up to continue testing and unlock unlimited access to all agents!
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowLimitModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px 20px",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "transparent",
                    color: "#ccc",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <Link
                  to="/login"
                  style={{
                    flex: 1,
                    padding: "12px 20px",
                    borderRadius: 8,
                    border: "none",
                    background: "linear-gradient(135deg, #646cff 0%, #ff64c8 100%)",
                    color: "white",
                    textDecoration: "none",
                    textAlign: "center",
                    fontWeight: 600
                  }}
                >
                  Sign Up Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




