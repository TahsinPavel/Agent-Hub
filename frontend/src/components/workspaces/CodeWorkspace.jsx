import { useState } from "react";
import { callAgent } from "../../api/agentApi";
import { useAuth } from "../../contexts/AuthContext";
import { useUsage } from "../../contexts/UsageContext";
import { useWorkspace } from "../../contexts/WorkspaceContext";

export default function CodeWorkspace() {
  const [task, setTask] = useState("");
  const [language, setLanguage] = useState("python");
  const [maxTokens, setMaxTokens] = useState(800); // Reduced default for faster responses
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { isAuthenticated } = useAuth();
  const { canUseAgent, incrementUsage } = useUsage();
  const { currentWorkspace } = useWorkspace();

  const languages = [
    "python", "javascript", "java", "cpp", "csharp", "go", 
    "rust", "php", "ruby", "swift", "kotlin", "typescript"
  ];

  const handleGenerate = async () => {
    if (!task.trim()) return;
    
    if (!canUseAgent('code-assistant', isAuthenticated)) {
      setError("Usage limit reached. Please sign up for unlimited access.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        task: task.trim(),
        language: language,
        max_tokens: maxTokens,
        temperature: 0.1
      };

      const result = await callAgent('code-assistant', payload);
      setResponse(result);
      
      if (!isAuthenticated) {
        incrementUsage('code-assistant');
      }
    } catch (err) {
      // Handle timeout errors specifically
      if (err.response?.status === 408) {
        setError("The AI is taking too long to respond. Please try a simpler request or reduce the max tokens setting.");
      } else {
        setError(err.response?.data?.error || err.message || "Code generation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
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
            <div style={{ fontSize: 48 }}>💻</div>
            <div>
              <h1 style={{ margin: 0, color: "white", fontSize: 28 }}>Code Assistant</h1>
              <p style={{ margin: "4px 0 0 0", color: "rgba(255,255,255,0.8)" }}>
                Workspace: {currentWorkspace?.name} | AI-powered code generation and debugging
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
            <h3 style={{ margin: "0 0 20px 0", color: "white" }}>Coding Task</h3>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, color: "rgba(255,255,255,0.9)" }}>
                Programming Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  fontSize: 14
                }}
              >
                {languages.map(lang => (
                  <option key={lang} value={lang} style={{ background: "#2c3e50" }}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", marginBottom: 8, color: "rgba(255,255,255,0.9)" }}>
                Describe what you want to build (be specific but concise)
              </label>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Create a function that calculates fibonacci numbers recursively..."
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

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, color: "rgba(255,255,255,0.9)" }}>
                Max Code Length: {maxTokens} tokens
              </label>
              <input
                type="range"
                min="200"
                max="3000"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !task.trim()}
              style={{
                width: "100%",
                padding: "16px 24px",
                borderRadius: 12,
                border: "none",
                background: loading ? "#666" : "linear-gradient(135deg, #3498db 0%, #2980b9 100%)",
                color: "white",
                fontSize: 16,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {loading ? "💻 Coding..." : "🚀 Generate Code"}
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
            <h3 style={{ margin: "0 0 20px 0", color: "white" }}>Generated Code</h3>
            
            <div style={{
              minHeight: 400,
              padding: 16,
              background: "rgba(0,0,0,0.4)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "monospace",
              fontSize: 13,
              lineHeight: 1.5,
              overflow: "auto"
            }}>
              {loading && (
                <div style={{ textAlign: "center", padding: 40, color: "white" }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>💻</div>
                  <p>AI is writing your code...</p>
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
                <pre style={{ 
                  margin: 0, 
                  whiteSpace: "pre-wrap", 
                  wordBreak: "break-word",
                  color: "#e6e6e6"
                }}>
                  {response.code || response.response || JSON.stringify(response, null, 2)}
                </pre>
              )}

              {!loading && !error && !response && (
                <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>⌨️</div>
                  <p>Your generated code will appear here...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}