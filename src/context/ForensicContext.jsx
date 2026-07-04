import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const ForensicContext = createContext();

export const useForensic = () => useContext(ForensicContext);

export const ForensicProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  
  const [evidence, setEvidence] = useState([]);
  const [events, setEvents] = useState([]);
  const [detections, setDetections] = useState([]);
  const [iocs, setIocs] = useState([]);
  const [risk, setRisk] = useState({ score: 12, level: 'Low', criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0 });
  const [aiData, setAiData] = useState({ incidentSummary: '', rootCause: '', attackExplanation: '', recommendations: [] });
  const [attackGraph, setAttackGraph] = useState({ nodes: [], links: [] });
  const [audits, setAudits] = useState([]);
  const [activePage, setActivePage] = useState('login'); // default page
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Fetch all forensic data from API/Simulation
  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [evidenceList, eventsList, detectionsList, iocList, riskScore, copilotData, graphData, auditLogs] = await Promise.all([
        api.getEvidence(),
        api.getTimeline(),
        api.getDetections(),
        api.getIocs(),
        api.getRiskScore(),
        api.getAiInvestigation(),
        api.getAttackGraph(),
        api.getAuditLogs()
      ]);

      setEvidence(evidenceList || []);
      setEvents(eventsList || []);
      setDetections(detectionsList || []);
      setIocs(iocList || []);
      setRisk(riskScore || { score: 12, level: 'Low', criticalCount: 0, highCount: 0, mediumCount: 0, lowCount: 0 });
      setAiData(copilotData || { incidentSummary: '', rootCause: '', attackExplanation: '', recommendations: [] });
      setAttackGraph(graphData || { nodes: [], links: [] });
      setAudits(auditLogs || []);

      // Check if we have new critical detections to push to notifications
      if (detectionsList && detectionsList.length > 0) {
        const criticalAlerts = detectionsList.filter(d => d.severity.toLowerCase() === 'critical');
        if (criticalAlerts.length > 0) {
          const formattedAlerts = criticalAlerts.map(alert => ({
            id: alert.id,
            message: `${alert.threatType}: ${alert.description}`,
            timestamp: alert.timestamp,
            read: false
          }));
          setNotifications(formattedAlerts);
        }
      }
    } catch (error) {
      console.error('Failed to sync forensic data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
      setActivePage('dashboard');
    } else {
      setActivePage('login');
    }
  }, [isAuthenticated]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const auth = await api.login(email, password);
      localStorage.setItem('token', auth.token);
      setToken(auth.token);
      setUser({
        name: auth.name,
        email: auth.email,
        role: auth.role,
        badgeId: auth.badgeId
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email, password, name, badgeId) => {
    setIsLoading(true);
    try {
      const response = await api.register(email, password, name, badgeId);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setActivePage('login');
  };

  const uploadEvidence = async (file) => {
    setIsLoading(true);
    try {
      const investigatorId = user?.badgeId || 'INV-2026-9904';
      const result = await api.uploadEvidence(file, investigatorId);
      await refreshData();
      return result;
    } catch (error) {
      console.error('Evidence upload failed', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetDatabase = async () => {
    setIsLoading(true);
    try {
      await api.resetDatabase();
      await refreshData();
      setNotifications([]);
    } catch (error) {
      console.error('Database reset failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const seedDatabase = async () => {
    setIsLoading(true);
    try {
      await api.seedDatabase();
      await refreshData();
    } catch (error) {
      console.error('Database seeding failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForensicContext.Provider value={{
      user,
      isAuthenticated,
      evidence,
      events,
      detections,
      iocs,
      risk,
      aiData,
      attackGraph,
      audits,
      activePage,
      isLoading,
      notifications,
      setActivePage,
      login,
      register,
      logout,
      uploadEvidence,
      resetDatabase,
      seedDatabase,
      refreshData
    }}>
      {children}
    </ForensicContext.Provider>
  );
};
