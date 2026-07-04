import React, { useState } from 'react';
import { useForensic } from '../context/ForensicContext';
import { Search, Filter, ShieldCheck, Key, ShieldAlert, Globe, Link, Hash } from 'lucide-react';

export default function IOCCenter() {
  const { iocs } = useForensic();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const getIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'ip': return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'url': return <Link className="w-4 h-4 text-purple-400" />;
      case 'domain': return <Globe className="w-4 h-4 text-fuchsia-400" />;
      case 'hash': return <Hash className="w-4 h-4 text-yellow-400" />;
      default: return <Key className="w-4 h-4 text-slate-400" />;
    }
  };

  const tabs = ['All', 'IP', 'Domain', 'URL', 'Hash'];

  const filteredIocs = iocs.filter(ioc => {
    const matchesSearch = ioc.value.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ioc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || ioc.type.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">Indicators of Compromise (IOC)</h1>
          <p className="text-sm text-slate-400">Extracted threat indicators and structural markers parsed from log evidence segments.</p>
        </div>
        
        {/* Statistics Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-400 shrink-0">
          <ShieldAlert className="w-4 h-4" />
          ACTIVE IOC REGISTRY: {iocs.length} ENTRIES
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search IOC records by values, descriptions..."
          className="w-full glass-input rounded-lg py-2.5 pl-10 pr-4 text-sm font-mono"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-900 gap-2">
        {tabs.map(tab => {
          const count = tab === 'All' ? iocs.length : iocs.filter(i => i.type.toLowerCase() === tab.toLowerCase()).length;
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

      {/* IOC Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIocs.length === 0 ? (
          <div className="col-span-full glass-card rounded-xl p-12 text-center text-slate-500 text-xs">
            No indicators of compromise indexed under this category filter.
          </div>
        ) : (
          filteredIocs.map((ioc) => (
            <div
              key={ioc.id}
              className="glass-card rounded-xl p-5 border border-slate-800/80 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-[10px] text-slate-500">ID: IOC-{ioc.id}</span>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold text-slate-300">
                    {getIcon(ioc.type)}
                    {ioc.type}
                  </div>
                </div>

                <div className="space-y-1 font-mono">
                  <span className="text-[10px] text-cyan-500 block uppercase">Indicator Value</span>
                  <span className="text-sm text-slate-200 font-semibold break-all select-all">{ioc.value}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-cyan-500 font-mono block uppercase">Description</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{ioc.description}</p>
                </div>
              </div>

              <div className="border-t border-slate-900 pt-4 mt-4 font-mono text-[9px] text-slate-500 flex items-center justify-between">
                <span>INTEL SOURCE:</span>
                <span className="text-slate-300 font-bold uppercase">{ioc.threatSource}</span>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
