import React, { useState, useEffect } from 'react';
import { useForensic } from '../context/ForensicContext';
import { api } from '../utils/api';
import { FileText, Download, FileSpreadsheet, FileJson, ShieldCheck, Mail } from 'lucide-react';

export default function Reports() {
  const { evidence, detections, risk, user } = useForensic();
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.getReports();
        setReportData(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReport();
  }, [evidence, detections]);

  const handleDownloadJson = () => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LOGFORX-CASE-REPORT-${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    if (!reportData) return;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Type,Value,Description,Severity,MITRE ATT&CK\n";
    
    detections.forEach(det => {
      csvContent += `"${det.threatType}","${det.status}","${det.description}","${det.severity}","${det.mitreTechnique}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LOGFORX-CASE-ALERTS-${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!reportData) {
    return <div className="text-center font-mono text-xs text-slate-500">Compiling Report Schema...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">Case Investigation Reports</h1>
          <p className="text-sm text-slate-400">Preview and download forensic reports detailing evidence files, threat details, and risk scores.</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleDownloadCsv}
            className="px-3 py-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/60 text-cyan-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            EXPORT CSV
          </button>
          
          <button
            onClick={handleDownloadJson}
            className="px-3 py-2 rounded-lg bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900/60 text-purple-400 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileJson className="w-3.5 h-3.5" />
            EXPORT JSON
          </button>
        </div>
      </div>

      {/* Case Summary Preview Card */}
      <div className="glass-card rounded-xl border border-slate-800/80 p-6 font-mono text-xs text-slate-300 space-y-6">
        
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-900 pb-5 gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider leading-none mb-1">LOGFORX FORENSIC REPORT</h2>
              <span className="text-[10px] text-slate-500">DOCUMENT ID: LFX-REP-{reportData.generatedAt.substring(0, 10)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            CRYPTOGRAPHICALLY VERIFIED
          </div>
        </div>

        {/* Case Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 border-b border-slate-900 pb-5 font-mono text-xs">
          <div>
            <span className="text-[10px] text-cyan-500 uppercase block mb-0.5">Case Reference</span>
            <span className="text-white font-bold">{reportData.caseName}</span>
          </div>
          <div>
            <span className="text-[10px] text-cyan-500 uppercase block mb-0.5">Compiled Date</span>
            <span className="text-white">{new Date(reportData.generatedAt).toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] text-cyan-500 uppercase block mb-0.5">Investigator-in-Charge</span>
            <span className="text-white">{user?.name || reportData.investigator}</span>
          </div>
          <div>
            <span className="text-[10px] text-cyan-500 uppercase block mb-0.5">Evaluated Posture Risk</span>
            <span className={`font-bold ${
              risk.level.toLowerCase() === 'critical' ? 'text-red-500' : 'text-yellow-500'
            }`}>{risk.score} / 100 ({risk.level})</span>
          </div>
        </div>

        {/* Ingested Evidence Summary */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-1.5">I. Ingested Evidence Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] divide-y divide-slate-900">
              <thead>
                <tr className="text-cyan-500 uppercase">
                  <th className="py-2">File Name</th>
                  <th className="py-2">Ingestion Time</th>
                  <th className="py-2">Type</th>
                  <th className="py-2 text-right">Verification SHA-256 Hash Signature</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-400">
                {reportData.evidenceList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-3 text-center text-slate-500 font-sans">No evidence logs indexed.</td>
                  </tr>
                ) : (
                  reportData.evidenceList.map((ev) => (
                    <tr key={ev.id}>
                      <td className="py-2 font-semibold text-slate-200">{ev.fileName}</td>
                      <td className="py-2">{new Date(ev.uploadTime).toLocaleDateString()}</td>
                      <td className="py-2 uppercase font-bold text-glow-cyan text-[10px]">{ev.fileType}</td>
                      <td className="py-2 text-right break-all max-w-[200px] select-all">{ev.hash}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Threat Alert Indicators summary */}
        <div className="space-y-3 pt-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-1.5">II. Threat Indicators Identified</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] divide-y divide-slate-900">
              <thead>
                <tr className="text-cyan-500 uppercase">
                  <th className="py-2">Incident Target</th>
                  <th className="py-2">MITRE technique</th>
                  <th className="py-2">Severity</th>
                  <th className="py-2 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-400">
                {reportData.alertList.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-3 text-center text-slate-500 font-sans">No suspicious alerts triggered.</td>
                  </tr>
                ) : (
                  reportData.alertList.map((alert) => (
                    <tr key={alert.id}>
                      <td className="py-2 font-semibold text-slate-200">{alert.threatType}</td>
                      <td className="py-2 text-purple-400 font-semibold">{alert.mitreTechnique}</td>
                      <td className="py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                          alert.severity.toLowerCase() === 'critical' ? 'text-red-500' : 'text-yellow-500'
                        }`}>{alert.severity}</span>
                      </td>
                      <td className="py-2 text-right text-slate-300 font-sans">{alert.description}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
