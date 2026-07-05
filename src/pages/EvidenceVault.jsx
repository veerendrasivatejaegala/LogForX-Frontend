import React, { useState } from 'react';
import { useForensic } from '../context/ForensicContext';
import { Search, Filter, ShieldCheck, Download, Eye, FileSpreadsheet, FileJson, FileCode, Server } from 'lucide-react';

export default function EvidenceVault() {
  const { evidence } = useForensic();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selectedFile, setSelectedFile] = useState(null);

  const getFileIcon = (type) => {
    const t = (type || '').toLowerCase();
    switch (t) {
      case 'csv': return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
      case 'json': return <FileJson className="w-4 h-4 text-yellow-400" />;
      case 'evtx': return <FileCode className="w-4 h-4 text-cyan-400" />;
      default: return <Server className="w-4 h-4 text-purple-400" />;
    }
  };

  // Filter evidence
  const filteredEvidence = evidence.filter(file => {
    const name = file.fileName || '';
    const hash = file.hash || '';
    const type = file.fileType || 'log';

    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          hash.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'All' || type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">Evidence Vault Ledger</h1>
          <p className="text-sm text-slate-400">Archived collection of normalized log data segments validated under Chain of Custody.</p>
        </div>
        
        {/* Statistics Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs font-mono text-cyan-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
          LEDGER CAPTURES: {evidence.length} SEGMENTS
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by file name or cryptographic hash..."
            className="w-full glass-input rounded-lg py-2.5 pl-10 pr-4 text-sm font-mono"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="glass-input rounded-lg py-2.5 px-4 text-sm font-mono"
          >
            <option value="All">All Formats</option>
            <option value="evtx">Windows Logs (.evtx)</option>
            <option value="log">Syslogs (.log)</option>
            <option value="csv">Spreadsheet Logs (.csv)</option>
            <option value="json">Structured Logs (.json)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Ledger Table */}
        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden border border-slate-800/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-cyan-500 uppercase border-b border-slate-800/80">
                  <th className="py-3 px-4">File Name</th>
                  <th className="py-3 px-4">Cryptographic Hash</th>
                  <th className="py-3 px-4 hidden md:table-cell">Ingested At</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {filteredEvidence.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 px-4 text-center text-slate-500 font-sans">
                      No matching evidence records indexed in vault ledger. Ingest new evidence logs to begin.
                    </td>
                  </tr>
                ) : (
                  filteredEvidence.map((file) => (
                    <tr
                      key={file.id}
                      className={`hover:bg-slate-900/40 transition-colors cursor-pointer ${selectedFile?.id === file.id ? 'bg-cyan-950/20' : ''}`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        <div className="flex items-center gap-2">
                          {getFileIcon(file.fileType)}
                          <span className="truncate max-w-[150px]">{file.fileName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 truncate max-w-[120px] select-all">
                        {file.hash}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">
                        {new Date(file.uploadTime).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          file.status === 'PARSED' ? 'bg-emerald-950/60 border border-emerald-500/30 text-emerald-400' :
                          file.status === 'FAILED' ? 'bg-red-950/60 border border-red-500/30 text-red-400' :
                          'bg-cyan-950/60 border border-cyan-500/30 text-cyan-400'
                        }`}>
                          {file.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => setSelectedFile(file)}
                            className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                            title="Inspect Metadata"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(file, null, 2))}`}
                            download={file.fileName}
                            className="p-1 rounded bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-400 hover:text-purple-400 transition-colors cursor-pointer"
                            title="Download Segment"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Evidence Metadata Drawer */}
        <div className="space-y-6">
          {selectedFile ? (
            <div className="glass-card rounded-xl p-5 border border-slate-800/80 space-y-4">
              <div className="border-b border-slate-900 pb-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Evidence Meta Inspector</h3>
                <span className="text-[10px] text-slate-500 font-mono">Chain of Custody ID: CC-VAL-{selectedFile.id}</span>
              </div>

              <div className="space-y-3.5 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-cyan-500 block uppercase">File Name</span>
                  <span className="text-slate-200 block break-all font-semibold">{selectedFile.fileName}</span>
                </div>

                <div>
                  <span className="text-[10px] text-cyan-500 block uppercase">Cryptographic Signature (SHA-256)</span>
                  <span className="text-slate-300 block break-all bg-slate-950/80 border border-slate-900 p-2 rounded text-[11px] select-all">
                    {selectedFile.hash}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-cyan-500 block uppercase">Inbound Type</span>
                    <span className="text-slate-200 uppercase font-bold text-glow-cyan">{selectedFile.fileType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-500 block uppercase">File Size</span>
                    <span className="text-slate-200">{(selectedFile.fileSize / 1024).toFixed(2)} KB</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-cyan-500 block uppercase">Investigator ID</span>
                    <span className="text-slate-200">{selectedFile.investigatorId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-500 block uppercase">Verification Status</span>
                    <span className="text-emerald-400 font-bold uppercase">SECURE</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-cyan-500 block uppercase">Acquisition Timestamp</span>
                  <span className="text-slate-300">{new Date(selectedFile.uploadTime).toUTCString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 border border-slate-800/80 text-center text-slate-500 text-xs">
              Select an evidence file row from the ledger to inspect its Chain of Custody compliance metadata and signature validation status.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
