import React, { useState } from 'react';
import { useForensic } from '../context/ForensicContext';
import { ShieldAlert, AlertTriangle, ShieldCheck, Play } from 'lucide-react';

export default function SuspiciousDetection() {
  const { detections, setActivePage } = useForensic();
  const [activeTab, setActiveTab] = useState('All');

  const getSeverityBadge = (severity) => {
    const sev = (severity || 'low').toLowerCase();
    switch (sev) {
      case 'critical':
        return 'bg-red-950/40 border border-red-500/40 text-red-400 text-glow-red animate-pulse';
      case 'high':
        return 'bg-orange-950/40 border border-orange-500/40 text-orange-400';
      case 'medium':
        return 'bg-yellow-950/40 border border-yellow-500/40 text-yellow-400';
      default:
        return 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-400';
    }
  };

  const tabs = ['All', 'Critical', 'High', 'Medium', 'Low'];
  
  const filteredDetections = detections.filter(d => {
    if (!d.severity) return activeTab === 'All' || activeTab.toLowerCase() === 'low';
    if (activeTab === 'All') return true;
    return d.severity.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">Suspicious Threat Detections</h1>
          <p className="text-sm text-slate-400">Security warnings flagged by LogForX rules. Threat indicators mapped against MITRE ATT&CK.</p>
        </div>
        
        {/* Alerts count summary */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-red-950/30 border border-red-500/30 text-red-400">
            CRITICAL: {detections.filter(d => d.severity && d.severity.toLowerCase() === 'critical').length}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-orange-950/30 border border-orange-500/30 text-orange-400">
            HIGH: {detections.filter(d => d.severity && d.severity.toLowerCase() === 'high').length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-900 gap-2">
        {tabs.map(tab => {
          const count = tab === 'All' ? detections.length : detections.filter(d => d.severity && d.severity.toLowerCase() === tab.toLowerCase()).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-4 text-xs font-mono uppercase tracking-wider relative cursor-pointer ${
                activeTab === tab ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab} ({count})
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Alert Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDetections.length === 0 ? (
          <div className="col-span-2 glass-card rounded-xl p-12 text-center text-slate-500 text-xs">
            No active threat indicators matched under selected severity configurations.
          </div>
        ) : (
          filteredDetections.map((alert) => (
            <div
              key={alert.id}
              className={`glass-card rounded-xl p-5 border relative overflow-hidden flex flex-col justify-between ${
                alert.severity && alert.severity.toLowerCase() === 'critical' ? 'border-red-500/30 hover:border-red-500/50 shadow-lg shadow-red-950/5' : 'border-slate-800/80'
              }`}
            >
              
              {/* Alert Header */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-3 font-mono">
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${getSeverityBadge(alert.severity)}`}>
                    {alert.severity} SEVERITY
                  </span>
                  <span className="text-[10px] text-slate-500">{new Date(alert.timestamp).toLocaleString()}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 font-mono flex items-center gap-2">
                  {alert.severity && (alert.severity.toLowerCase() === 'critical' || alert.severity.toLowerCase() === 'high') ? (
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                  )}
                  {alert.threatType}
                </h3>
                
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{alert.description}</p>
              </div>

              {/* MITRE Mapping & AI Action */}
              <div className="border-t border-slate-900 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-[10px]">
                <div className="flex flex-col">
                  <span className="text-slate-500">ATT&CK Technique</span>
                  <span className="text-cyan-400 font-semibold">{alert.mitreTechnique}</span>
                </div>
                
                <button
                  onClick={() => setActivePage('ai')}
                  className="px-3 py-1.5 rounded bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60 text-cyan-400 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  AI COPILOT ANALYSIS
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
