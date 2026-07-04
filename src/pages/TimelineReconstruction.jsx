import React, { useState } from 'react';
import { useForensic } from '../context/ForensicContext';
import { Clock, ShieldAlert, ChevronDown, ChevronUp, Terminal, Search, Filter } from 'lucide-react';

export default function TimelineReconstruction() {
  const { events } = useForensic();
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getSeverityStyle = (sev) => {
    switch (sev.toLowerCase()) {
      case 'critical': return 'border-red-500/50 bg-red-950/40 text-red-400 text-glow-red';
      case 'high': return 'border-orange-500/50 bg-orange-950/40 text-orange-400';
      case 'medium': return 'border-yellow-500/50 bg-yellow-950/40 text-yellow-400';
      default: return 'border-cyan-500/50 bg-cyan-950/40 text-cyan-400';
    }
  };

  // Filter and sort events chronologically
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.payloadDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeverity = severityFilter === 'All' || event.severity.toLowerCase() === severityFilter.toLowerCase();
      const matchesType = typeFilter === 'All' || event.eventType.toLowerCase() === typeFilter.toLowerCase();
      
      return matchesSearch && matchesSeverity && matchesType;
    })
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">Forensic Timeline Reconstruction</h1>
        <p className="text-sm text-slate-400">Chronological analysis of event logs across ingested systems. Use nodes to trace attacker footprints.</p>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search timeline for IPs, process images, users, actions..."
            className="w-full glass-input rounded-lg py-2.5 pl-10 pr-4 text-sm font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-2.5">
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="glass-input rounded-lg py-2.5 px-4 text-xs font-mono"
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="glass-input rounded-lg py-2.5 px-4 text-xs font-mono"
          >
            <option value="All">All Categories</option>
            <option value="Login">Authentication (Login)</option>
            <option value="Process">Execution (Process)</option>
            <option value="Network">Traffic (Network)</option>
            <option value="FileSystem">Modification (FileSystem)</option>
            <option value="System">System Audit Logs</option>
          </select>
        </div>
      </div>

      {/* Chronological Vertical Timeline */}
      <div className="glass-card rounded-xl p-6 border border-slate-800/80 relative overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-sans text-xs">
            No forensic events logged for reconstruction. Ingest evidence files to populate chronological logs.
          </div>
        ) : (
          <div className="relative pl-6 border-l border-slate-800 space-y-6">
            
            {filteredEvents.map((event, index) => {
              const isExpanded = expandedId === event.id;
              
              return (
                <div key={event.id} className="relative group">
                  
                  {/* Timeline bullet node */}
                  <span className={`absolute -left-[30px] top-1.5 w-4 h-4 rounded-full border-2 bg-[#030712] flex items-center justify-center transition-all group-hover:scale-110 ${
                    event.severity.toLowerCase() === 'critical' ? 'border-red-500 shadow-lg shadow-red-950/40' :
                    event.severity.toLowerCase() === 'high' ? 'border-orange-500' :
                    event.severity.toLowerCase() === 'medium' ? 'border-yellow-500' : 'border-cyan-400'
                  }`} />

                  {/* Timeline Entry Card */}
                  <div className={`glass-card rounded-lg border p-4 transition-all relative overflow-hidden ${
                    isExpanded ? 'border-cyan-500/40 bg-cyan-950/5' : 'border-slate-800/60 hover:border-slate-700'
                  }`}>
                    
                    {/* Entry Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer" onClick={() => toggleExpand(event.id)}>
                      <div className="flex items-start md:items-center gap-3">
                        <span className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[10px] flex items-center gap-1.5 shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                            {event.action}
                            <span className={`px-2 py-0.5 rounded text-[9px] border font-mono ${getSeverityStyle(event.severity)}`}>
                              {event.severity}
                            </span>
                          </h4>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Category: {event.eventType} | Source: {event.source}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 font-mono text-[10px] text-slate-400">
                        <div className="flex flex-col md:items-end">
                          <span>User: <strong className="text-slate-300">{event.username}</strong></span>
                          <span>IP: <strong className="text-slate-300">{event.ipAddress}</strong></span>
                        </div>
                        <button className="text-slate-500 hover:text-slate-300">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Details Drawer */}
                    {isExpanded && (
                      <div className="mt-4 border-t border-slate-900 pt-4 space-y-3 font-mono text-xs">
                        <div className="p-4 bg-slate-950/80 border border-slate-900 rounded-lg text-slate-300 leading-relaxed max-h-48 overflow-y-auto">
                          <div className="flex items-center gap-1.5 text-cyan-500 font-bold border-b border-slate-900 pb-1.5 mb-2 uppercase text-[10px]">
                            <Terminal className="w-4 h-4" />
                            Raw Payload Dump
                          </div>
                          <p className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-slate-200">{event.payloadDetails}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-500 uppercase tracking-wider">
                          <div>
                            <span>Original Ingestion File: </span>
                            <span className="text-purple-400 underline">{event.evidenceFileName}</span>
                          </div>
                          <div className="text-right">
                            <span>Ingestion Log index: </span>
                            <span className="text-slate-300">#{event.id}</span>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
}
