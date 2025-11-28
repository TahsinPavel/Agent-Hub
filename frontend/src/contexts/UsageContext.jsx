import { createContext, useContext, useState, useEffect } from 'react';

const UsageContext = createContext();

export const useUsage = () => {
  const context = useContext(UsageContext);
  if (!context) {
    throw new Error('useUsage must be used within a UsageProvider');
  }
  return context;
};

export const UsageProvider = ({ children }) => {
  const [usage, setUsage] = useState({});
  const FREE_LIMIT = 3; // 3 free tests per agent

  useEffect(() => {
    // Load usage from localStorage
    const savedUsage = localStorage.getItem('agent_usage');
    if (savedUsage) {
      setUsage(JSON.parse(savedUsage));
    }
  }, []);

  const saveUsage = (newUsage) => {
    setUsage(newUsage);
    localStorage.setItem('agent_usage', JSON.stringify(newUsage));
  };

  const incrementUsage = (agentId) => {
    const newUsage = {
      ...usage,
      [agentId]: (usage[agentId] || 0) + 1
    };
    saveUsage(newUsage);
    return newUsage[agentId];
  };

  const getUsageCount = (agentId) => {
    return usage[agentId] || 0;
  };

  const canUseAgent = (agentId, isAuthenticated) => {
    if (isAuthenticated) return true;
    return getUsageCount(agentId) < FREE_LIMIT;
  };

  const getRemainingUses = (agentId, isAuthenticated) => {
    if (isAuthenticated) return Infinity;
    return Math.max(0, FREE_LIMIT - getUsageCount(agentId));
  };

  const resetUsage = () => {
    setUsage({});
    localStorage.removeItem('agent_usage');
  };

  return (
    <UsageContext.Provider value={{
      usage,
      incrementUsage,
      getUsageCount,
      canUseAgent,
      getRemainingUses,
      resetUsage,
      FREE_LIMIT
    }}>
      {children}
    </UsageContext.Provider>
  );
};