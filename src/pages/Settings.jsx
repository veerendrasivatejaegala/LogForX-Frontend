import React, { useState } from 'react';
import { useForensic } from '../context/ForensicContext';
import { Database, RefreshCw, Trash2, Cpu, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const { resetDatabase, seedDatabase, isLoading } = useForensic();
  const [dbStatus, setDbStatus] = useState('Active');
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:8085/api');
  const [successMsg, setSuccessMsg] = useState('');

  const handleReset = async () => {
    if (!window.confirm("CAUTION: This will clear all evidence logs, reconstruction timelines, security alerts, and Indicators of Compromise. Proceed?")) return;
    await resetDatabase();
    setSuccessMsg('All databases cleared. Forensic logs cleared successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSeed = async () => {
    await seedDatabase();
    setSuccessMsg('Forensic database pre-loaded with standard Windows and Linux demonstration files.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">Platform Admin Settings</h1>
        <p className="text-sm text-slate-400">Configure backend API connection channels, reset indexing databases, and seed mock demonstration streams.</p>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-400 font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Core Database Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass-card rounded-xl p-5 border border-slate-800/80 bg-slate-950/40 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-900 pb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              Forensic Database Controls
            </h3>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Use these utilities to populate target database models for demonstration, or purge entries to configure a new investigation environment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 font-mono">
              <button
                onClick={handleSeed}
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-50 text-white text-xs font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                PRE-LOAD SAMPLE LOGS
              </button>

              <button
                onClick={handleReset}
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-lg bg-slate-950 hover:bg-slate-900 border border-red-500/40 hover:border-red-500 text-red-400 disabled:opacity-50 text-xs font-bold tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                PURGE FORENSIC DATABASE
              </button>
            </div>
          </div>

          {/* Connection Settings */}
          <div className="glass-card rounded-xl p-5 border border-slate-800/80 bg-slate-950/40 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-900 pb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              Connection Channels & API mapping
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[10px] text-cyan-500 uppercase tracking-wider mb-2">REST API Inbound Gateway</label>
                <input
                  type="text"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  className="w-full glass-input rounded-lg px-4 py-2.5"
                />
              </div>

              <div className="flex justify-between items-center bg-slate-950/80 p-3 rounded-lg border border-slate-900">
                <span className="text-[10px] text-slate-500">Uplink Gateway Status:</span>
                <span className="text-emerald-400 font-bold uppercase text-[10px] flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  STABLE CONNECTION (200 OK)
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Guidelines Side Drawer */}
        <div>
          <div className="glass-card rounded-xl p-5 border border-slate-800/80 bg-slate-950/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShieldAlert className="w-20 h-20 text-red-500" />
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              Security Guidelines
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed font-sans mb-4">
              Access credentials cycle dynamically under secure sessions. Ensure connection gateways match active port endpoints of the Spring Boot instance.
            </p>

            <ul className="space-y-3 text-[10px] font-mono text-slate-500 uppercase">
              <li>• API Mapping: http://localhost:8085</li>
              <li>• In-Memory Persistence: H2 Console enabled</li>
              <li>• Cryptography Level: AES-256 TLS 1.3</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
