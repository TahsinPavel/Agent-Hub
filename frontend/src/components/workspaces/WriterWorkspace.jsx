import { useState } from "react";
import { callAgent } from "../../api/agentApi";
import { useAuth } from "../../contexts/AuthContext";
import { useUsage } from "../../contexts/UsageContext";
import { useWorkspace } from "../../contexts/WorkspaceContext";

export default function WriterWorkspace() {
  const [prompt, setPrompt] = useState("");
  const [systemMessage, setSystemMessage] = useState("You are a creative writing assistant. Provide concise, focused responses without unnecessary elaboration.");
  const [maxTokens, setMaxTokens] = useState(300); // Reduced default for faster responses
  const [temperature, setTemperature] = useState(0.7); // Slightly more creative but still focused
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();
  const { canUseAgent, incrementUsage } = useUsage();
  const { currentWorkspace } = useWorkspace();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    if (!canUseAgent('writer', isAuthenticated)) {
      setError("Usage limit reached. Please sign up for unlimited access.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        prompt: prompt.trim(),
        system_message: systemMessage,
        max_tokens: maxTokens,
        temperature: temperature
      };

      const result = await callAgent('writer', payload);
      setResponse(result);
      
      if (!isAuthenticated) {
        incrementUsage('writer');
      }
    } catch (err) {
      // Handle timeout errors specifically
      if (err.response?.status === 408) {
        setError("The AI is taking too long to respond. Please try a simpler request or reduce the max tokens setting.");
      } else {
        setError(err.response?.data?.error || err.message || "Generation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: 20,
      paddingTop: '100px' // Add extra space for fixed navbar and workspace selector
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ 
          background: "rgba(255,255,255,0.1)", 
          borderRadius: 16, 
          padding: 24, 
          marginBottom: 24,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 48 }}>✍️</div>
            <div>
              <h1 style={{ margin: 0, color: "white", fontSize: 28 }}>Writer Agent</h1>
              <p style={{ margin: "4px 0 0 0", color: "rgba(255,255,255,0.8)" }}>
                Workspace: {currentWorkspace?.name} | Creative writing and content creation
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Input Panel */}
          <div style={{ 
            background: "rgba(255,255,255,0.1)", 
            borderRadius: 16, 
            padding: 24,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <h3 style={{ margin: "0 0 20px 0", color: "white" }}>Writing Request</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, color: "rgba(255,255,255,0.9)" }}>
                What would you like me to write? (be specific but concise for faster responses)
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write a short story about a robot discovering emotions..."
                style={{
                  width: "100%",
                  height: 120,
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: 14,
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, color: "rgba(255,255,255,0.9)" }}>
                Writing Style Instructions
              </label>
              <input
                type="text"
                value={systemMessage}
                onChange={(e) => setSystemMessage(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: 14
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, color: "rgba(255,255,255,0.9)" }}>
                  Max Words: {maxTokens}
                </label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, color: "rgba(255,255,255,0.9)" }}>
                  Creativity: {temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: 12,
                border: "none",
                background: loading ? "#666" : "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
                color: "white",
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {loading ? "✍️ Writing..." : "🚀 Generate Content"}
            </button>
            
            <div style={{ 
              marginTop: 16, 
              padding: 12, 
              background: "rgba(255,255,255,0.05)", 
              borderRadius: 8, 
              fontSize: 12, 
              color: "#ccc" 
            }}>
              💡 <strong>Tip:</strong> For faster responses, be specific but concise in your request and use lower max tokens values.
            </div>

          </div>

          {/* Output Panel */}
          <div style={{ 
            background: "rgba(255,255,255,0.1)", 
            borderRadius: 16, 
            padding: 24,
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)"
          }}>
            <h3 style={{ margin: "0 0 20px 0", color: "white" }}>Generated Content</h3>
            
            <div style={{
              minHeight: 400,
              padding: 16,
              background: "rgba(0,0,0,0.3)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#ccc",
              fontSize: 14,
              lineHeight: 1.6,
              overflow: "auto"
            }}>
              {loading && (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>✍️</div>
                  <p>AI is crafting your content...</p>
                </div>
              )}

              {error && (
                <div style={{ 
                  color: "#ff6b6b", 
                  padding: 16, 
                  background: "rgba(255,107,107,0.1)", 
                  borderRadius: 8,
                  border: "1px solid rgba(255,107,107,0.3)"
                }}>
                  <strong>Error:</strong> {error}
                </div>
              )}

              {response && (
                <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                  {response.response || response.content || JSON.stringify(response, null, 2)}
                </div>
              )}

              {!loading && !error && !response && (
                <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>📝</div>
                  <p>Your generated content will appear here...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}