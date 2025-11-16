import { useState } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';

export default function WorkspaceSelector() {
  const { currentWorkspace, workspaces, switchWorkspace, createWorkspace } = useWorkspace();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    setCreating(true);
    try {
      await createWorkspace(newWorkspaceName.trim());
      setNewWorkspaceName('');
      setShowCreateForm(false);
      setIsOpen(false);
    } catch (err) {
      alert('Failed to create workspace');
    } finally {
      setCreating(false);
    }
  };

  if (!currentWorkspace) {
    return (
      <div style={{ 
        padding: '8px 16px', 
        background: 'rgba(255,255,255,0.1)', 
        borderRadius: 8,
        color: '#999'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8,
          color: 'white',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 500,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.15)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255,255,255,0.1)';
        }}
      >
        <span>🏢</span>
        <span>{currentWorkspace.name}</span>
        <span style={{ fontSize: 12, opacity: 0.7 }}>▼</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: 'rgba(20, 20, 20, 0.95)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 8,
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          minWidth: 200
        }}>
          <div style={{ padding: '8px 0' }}>
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                onClick={() => {
                  switchWorkspace(workspace);
                  setIsOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: workspace.id === currentWorkspace.id ? 'rgba(100, 108, 255, 0.2)' : 'transparent',
                  border: 'none',
                  color: 'white',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (workspace.id !== currentWorkspace.id) {
                    e.target.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (workspace.id !== currentWorkspace.id) {
                    e.target.style.background = 'transparent';
                  }
                }}
              >
                <span>{workspace.is_owner ? '👑' : '👤'}</span>
                <span>{workspace.name}</span>
                {workspace.id === currentWorkspace.id && (
                  <span style={{ marginLeft: 'auto', color: '#646cff' }}>✓</span>
                )}
              </button>
            ))}
            
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '8px 0' }} />
            
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'transparent',
                  border: 'none',
                  color: '#646cff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <span>➕</span>
                <span>Create Workspace</span>
              </button>
            ) : (
              <form onSubmit={handleCreateWorkspace} style={{ padding: '12px 16px' }}>
                <input
                  type="text"
                  placeholder="Workspace name"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 6,
                    color: 'white',
                    fontSize: 14,
                    marginBottom: 8
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="submit"
                    disabled={creating || !newWorkspaceName.trim()}
                    style={{
                      padding: '6px 12px',
                      background: '#646cff',
                      border: 'none',
                      borderRadius: 4,
                      color: 'white',
                      fontSize: 12,
                      cursor: creating ? 'not-allowed' : 'pointer',
                      opacity: creating || !newWorkspaceName.trim() ? 0.5 : 1
                    }}
                  >
                    {creating ? 'Creating...' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewWorkspaceName('');
                    }}
                    style={{
                      padding: '6px 12px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 4,
                      color: 'white',
                      fontSize: 12,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}