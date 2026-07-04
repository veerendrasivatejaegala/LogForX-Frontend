import React, { useState } from 'react';
import { useForensic } from '../context/ForensicContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Shield, Layers, Upload, Database, Clock, ShieldAlert,
  Cpu, Key, AlertTriangle, Network, FileText, ClipboardList, Settings as SettingsIcon,
  LogOut, Bell, Search, User, Menu, X, ChevronLeft, ChevronRight
} from 'lucide-react';

// Import subpages
import Overview from './Overview';
import EvidenceUpload from './EvidenceUpload';
import EvidenceVault from './EvidenceVault';
import TimelineReconstruction from './TimelineReconstruction';
import SuspiciousDetection from './SuspiciousDetection';
import AIInvestigation from './AIInvestigation';
import IOCCenter from './IOCCenter';
import RiskScore from './RiskScore';
import AttackGraph from './AttackGraph';
import Reports from './Reports';
import AuditLogs from './AuditLogs';
import Settings from './Settings';

export default function Dashboard() {
  const { activePage, setActivePage, logout, user, notifications, risk } = useForensic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'SOC Dashboard', icon: <Layers className="w-5.5 h-5.5 text-sky-400" strokeWidth={1.8} /> },
    { id: 'upload', label: 'Upload Evidence', icon: <Upload className="w-5.5 h-5.5 text-emerald-400" strokeWidth={1.8} /> },
    { id: 'vault', label: 'Evidence Vault', icon: <Database className="w-5.5 h-5.5 text-amber-400" strokeWidth={1.8} /> },
    { id: 'timeline', label: 'Timeline Reconstruction', icon: <Clock className="w-5.5 h-5.5 text-indigo-400" strokeWidth={1.8} /> },
    { id: 'detections', label: 'Suspicious Detection', icon: <ShieldAlert className="w-5.5 h-5.5 text-rose-500" strokeWidth={1.8} /> },
    { id: 'ai', label: 'AI Investigation', icon: <Cpu className="w-5.5 h-5.5 text-fuchsia-400" strokeWidth={1.8} /> },
    { id: 'ioc', label: 'IOC Center', icon: <Key className="w-5.5 h-5.5 text-teal-400" strokeWidth={1.8} /> },
    { id: 'risk', label: 'Risk Score', icon: <AlertTriangle className="w-5.5 h-5.5 text-yellow-500" strokeWidth={1.8} /> },
    { id: 'graph', label: 'Attack Graph', icon: <Network className="w-5.5 h-5.5 text-orange-400" strokeWidth={1.8} /> },
    { id: 'reports', label: 'Investigation Reports', icon: <FileText className="w-5.5 h-5.5 text-cyan-400" strokeWidth={1.8} /> },
    { id: 'audits', label: 'Audit Logs', icon: <ClipboardList className="w-5.5 h-5.5 text-slate-300" strokeWidth={1.8} /> },
    { id: 'settings', label: 'Platform Settings', icon: <SettingsIcon className="w-5.5 h-5.5 text-purple-400" strokeWidth={1.8} /> }
  ];

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard': return <Overview />;
      case 'upload': return <EvidenceUpload />;
      case 'vault': return <EvidenceVault />;
      case 'timeline': return <TimelineReconstruction />;
      case 'detections': return <SuspiciousDetection />;
      case 'ai': return <AIInvestigation />;
      case 'ioc': return <IOCCenter />;
      case 'risk': return <RiskScore />;
      case 'graph': return <AttackGraph />;
      case 'reports': return <Reports />;
      case 'audits': return <AuditLogs />;
      case 'settings': return <Settings />;
      default: return <Overview />;
    }
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
  };

  // Get active menu label
  const activeLabel = menuItems.find(item => item.id === activePage)?.label || 'SOC Dashboard';

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex relative">
      
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Desktop Sidebar Navigation */}
      <aside className={`hidden lg:flex flex-col ${isCollapsed ? 'w-20' : 'w-64'} bg-[#181818] border-r border-[#2d2d2d] z-20 shrink-0 h-screen sticky top-0 transition-all duration-300`}>
        <div className={`p-4 border-b border-[#2d2d2d] flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'} h-16 bg-[#181818]`}>
          <div className="p-2 rounded-lg bg-[#252526] shadow-[-2px_-2px_6px_rgba(255,255,255,0.02),_3px_3px_8px_rgba(0,0,0,0.4)] border border-[#2d2d2d]/60 text-cyan-400 shrink-0">
            <Terminal className="w-5.5 h-5.5 text-cyan-400" strokeWidth={1.8} />
          </div>
          {!isCollapsed && (
            <div className="animate-fade-in whitespace-nowrap">
              <h1 className="text-sm font-bold tracking-widest text-white leading-none font-mono">LOGFORX</h1>
              <span className="text-[9px] text-cyan-500 font-mono tracking-widest uppercase">Digital Forensics</span>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 overflow-y-auto space-y-2.5 font-mono text-xs">
          {menuItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handlePageChange(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-1' : 'justify-start gap-3 px-3.5'} py-2.5 rounded-xl transition-all text-left cursor-pointer group border ${
                  isActive
                    ? 'bg-[#1a1a1b] text-cyan-400 font-bold shadow-[inset_3px_3px_6px_rgba(0,0,0,0.6),_inset_-2px_-2px_5px_rgba(255,255,255,0.01)] border-[#2d2d2d]/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#252526] hover:shadow-[-2px_-2px_6px_rgba(255,255,255,0.015),_3px_3px_8px_rgba(0,0,0,0.45)] border-transparent hover:border-[#2d2d2d]/40'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={`p-1 rounded transition-all group-hover:scale-110 ${isActive ? 'scale-105 opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className={`p-4 border-t border-[#2d2d2d] bg-[#181818] font-mono text-[10px] space-y-3 ${isCollapsed ? 'items-center flex flex-col justify-center' : ''}`}>
          {/* Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full py-2 bg-[#252526]/80 hover:bg-[#252526] border border-[#2d2d2d]/60 text-slate-400 hover:text-slate-200 transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer font-bold uppercase tracking-wider shadow-[-2px_-2px_5px_rgba(255,255,255,0.01),_3px_3px_6px_rgba(0,0,0,0.35)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5 text-slate-400" strokeWidth={1.8} /> : <ChevronLeft className="w-5 h-5 text-slate-400" strokeWidth={1.8} />}
            {!isCollapsed && <span className="text-[9px]">Collapse Menu</span>}
          </button>

          <div className="flex items-center gap-2 w-full overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-[#1a1a1b] border border-[#2d2d2d]/80 flex items-center justify-center text-slate-300 shrink-0 mx-auto shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]">
              <User className="w-5 h-5 text-slate-300" strokeWidth={1.8} />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="text-slate-200 font-bold block truncate">{user?.name || 'John Doe'}</span>
                <span className="text-slate-500 text-[9px]">{user?.badgeId || 'INV-2026-9904'}</span>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="w-full py-2 bg-[#252526] hover:bg-red-950/20 border border-[#2d2d2d]/80 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer font-bold uppercase tracking-wider shadow-[-2px_-2px_5px_rgba(255,255,255,0.01),_3px_3px_6px_rgba(0,0,0,0.35)] active:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)]"
            title={isCollapsed ? "Logout Terminal" : undefined}
          >
            <LogOut className="w-5 h-5 text-rose-400" strokeWidth={1.8} />
            {!isCollapsed && <span>LOGOUT TERMINAL</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        
        {/* Sticky Header Navbar */}
        <header className="sticky top-0 bg-[#030712]/80 backdrop-blur-md border-b border-slate-900 z-30 h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="hidden lg:block text-sm font-bold text-slate-400 font-mono uppercase tracking-wider">
              Platform / <span className="text-white">{activeLabel}</span>
            </h2>
            <div className="lg:hidden flex items-center gap-1.5">
              <Terminal className="w-4.5 h-4.5 text-cyan-400" />
              <h1 className="text-sm font-bold text-white tracking-widest font-mono">LOGFORX</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Search inputs bar wrapper */}
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Lookup telemetry..."
                className="w-full glass-input rounded-md py-1.5 pl-8 pr-3 text-xs font-mono"
              />
            </div>

            {/* Notification bell widget */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-900/40 border border-transparent transition-colors relative cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 shadow-md shadow-red-950/50 animate-ping" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 glass-card border border-slate-800/80 rounded-xl p-4 shadow-xl z-50 text-xs font-mono"
                  >
                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-900">
                      <span className="font-bold text-slate-300 uppercase">Alert Alerts ({notifications.length})</span>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-slate-300">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className="space-y-3.5 max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-center py-4 text-slate-600">No active critical alerts flagged.</div>
                      ) : (
                        notifications.map((notif) => (
                          <div key={notif.id} className="p-2.5 rounded bg-slate-900 border border-slate-850 flex gap-2">
                            <span className="text-red-500 font-bold shrink-0">[!]</span>
                            <div>
                              <p className="text-slate-300 text-[10px] leading-relaxed">{notif.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile badge header */}
            <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
              <div className="text-right hidden sm:block font-mono">
                <span className="text-[10px] font-bold text-slate-300 block leading-none">{user?.name || 'Investigator John'}</span>
                <span className="text-[8px] text-cyan-500">{user?.badgeId || 'INV-2026'}</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-xs">
                INV
              </div>
            </div>

          </div>
        </header>

        {/* Dynamic page embedding body container */}
        <main className="flex-1 p-6 overflow-y-auto z-10 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 25, scale: 0.98, rotateX: 2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.98, rotateX: -2 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'top center' }}
              className="h-full"
            >
              {renderActivePage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Responsive mobile overlay hamburger navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#030712]/90 backdrop-blur-md z-50 flex"
          >
            <div className="w-64 bg-[#080d16] border-r border-slate-900 p-5 flex flex-col justify-between h-full relative">
              
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-2 pb-5 border-b border-slate-900">
                  <Terminal className="w-5 h-5 text-cyan-400" />
                  <div>
                    <h1 className="text-sm font-bold text-white tracking-widest leading-none">LOGFORX</h1>
                    <span className="text-[8px] text-cyan-500 font-mono tracking-widest uppercase">Digital Forensics</span>
                  </div>
                </div>

                <nav className="space-y-1.5 font-mono text-xs max-h-[70vh] overflow-y-auto">
                  {menuItems.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handlePageChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left cursor-pointer ${
                          isActive
                            ? 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 font-bold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="border-t border-slate-900 pt-4 font-mono text-[9px] space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <span className="text-slate-200 font-bold block">{user?.name || 'John Doe'}</span>
                    <span className="text-slate-500">{user?.badgeId || 'INV-2026-9904'}</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full py-2 bg-slate-900 border border-slate-850 hover:bg-red-950/30 text-slate-400 hover:text-red-400 rounded text-center cursor-pointer font-bold uppercase transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 inline mr-1" />
                  LOGOUT
                </button>
              </div>

            </div>
            
            <div className="flex-1 cursor-pointer" onClick={() => setMobileMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
