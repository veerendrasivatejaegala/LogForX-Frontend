import React, { useState } from 'react';
import { useForensic } from '../context/ForensicContext';
import { Search, Filter, ClipboardList, Database, ShieldAlert } from 'lucide-react';

export default function AuditLogs() {
  const { audits } = useForensic();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('All');

  const filteredAudits = audits.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.investigatorId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'All' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action) => {
    switch (action) {
      case 'LOGIN': return 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-400';
      case 'EVIDENCE_UPLOAD': return 'bg-purple-950/60 border border-purple-500/30 text-purple-400';
      case 'SYSTEM_RESET': return 'bg-red-950/60 border border-red-500/30 text-red-400';
      case 'DATABASE_SEEDED': return 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400';
      default: return 'bg-slate-900 border border-slate-800 text-slate-300';
    }
  };

  const actionTypes = ['All', 'LOGIN', 'EVIDENCE_UPLOAD', 'SYSTEM_RESET', 'DATABASE_SEEDED'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">Platform Audit Logs</h1>
          <p className="text-sm text-slate-400">Verifiable logging ledger tracking investigator operations and administrative interactions.</p>
        </div>
        
        {/* Statistics Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-400 shrink-0">
          <ClipboardList className="w-4 h-4" />
          AUDIT ENTRIES: {audits.length} LOGGED
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audits by investigator ID, action details..."
            className="w-full glass-input rounded-lg py-2.5 pl-10 pr-4 text-sm font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="glass-input rounded-lg py-2.5 px-4 text-sm font-mono"
          >
            {actionTypes.map(type => (
              <option key={type} value={type}>{type === 'All' ? 'All Operations' : type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table Grid */}
      <div className="glass-card rounded-xl overflow-hidden border border-slate-800/80">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-slate-950/80 text-cyan-500 uppercase border-b border-slate-800/80">
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Operation Type</th>
                <th className="py-3 px-4">Investigator ID</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-400">
              {filteredAudits.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 px-4 text-center text-slate-500 font-sans">
                    No matching compliance logs indexed in audit database.
                  </td>
                </tr>
              ) : (
                filteredAudits.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-3.5 px-4 text-slate-500">#AD-{log.id}</td>
                    <td className="py-3.5 px-4">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-bold">{log.investigatorId}</td>
                    <td className="py-3.5 px-4 text-slate-200">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
