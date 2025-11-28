import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { WorkspaceProvider } from "./contexts/WorkspaceContext";
import { UsageProvider } from "./contexts/UsageContext";
import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import AgentTester from "./pages/AgentTester";
import AgentWorkspace from "./pages/AgentWorkspace";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <UsageProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/agent-tester" element={<AgentTester />} />
              <Route path="/workspace/:agentId" element={<AgentWorkspace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Login />} />
            </Routes>
          </Router>
        </UsageProvider>
      </WorkspaceProvider>
    </AuthProvider>
  );
}

export default App;