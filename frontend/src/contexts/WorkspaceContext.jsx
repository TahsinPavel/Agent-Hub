import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const WorkspaceContext = createContext();

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

export const WorkspaceProvider = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's workspaces
  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/workspaces/');
      setWorkspaces(response.data);
      
      // Set default workspace (first one or user's owned workspace)
      if (response.data.length > 0 && !currentWorkspace) {
        const defaultWorkspace = response.data.find(w => w.is_owner) || response.data[0];
        setCurrentWorkspace(defaultWorkspace);
      }
    } catch (err) {
      setError('Failed to load workspaces');
      console.error('Workspace fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Switch workspace
  const switchWorkspace = (workspace) => {
    setCurrentWorkspace(workspace);
    localStorage.setItem('currentWorkspaceId', workspace.id);
  };

  // Create new workspace
  const createWorkspace = async (name) => {
    try {
      const response = await axios.post('/api/workspaces/', { name });
      const newWorkspace = response.data;
      setWorkspaces(prev => [...prev, newWorkspace]);
      setCurrentWorkspace(newWorkspace);
      return newWorkspace;
    } catch (err) {
      throw new Error('Failed to create workspace');
    }
  };

  useEffect(() => {
    fetchWorkspaces();
    
    // Restore workspace from localStorage
    const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
    if (savedWorkspaceId) {
      // Will be set when workspaces are loaded
    }
  }, []);

  // Update current workspace when workspaces are loaded
  useEffect(() => {
    const savedWorkspaceId = localStorage.getItem('currentWorkspaceId');
    if (savedWorkspaceId && workspaces.length > 0) {
      const savedWorkspace = workspaces.find(w => w.id === parseInt(savedWorkspaceId));
      if (savedWorkspace) {
        setCurrentWorkspace(savedWorkspace);
      }
    }
  }, [workspaces]);

  const value = {
    currentWorkspace,
    workspaces,
    loading,
    error,
    switchWorkspace,
    createWorkspace,
    fetchWorkspaces
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};