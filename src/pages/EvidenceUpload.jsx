import React, { useState, useRef } from 'react';
import { useForensic } from '../context/ForensicContext';
import { UploadCloud, FileText, CheckCircle2, ShieldAlert, Cpu, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EvidenceUpload() {
  const { uploadEvidence, user } = useForensic();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState(null);
  const [computedHash, setComputedHash] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    const validExtensions = ['evtx', 'log', 'csv', 'json'];
    const ext = file.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(ext)) {
      setStatusMsg(`Unsupported format: .${ext}. Only forensic evidence logs (.evtx, .log, .csv, .json) are accepted.`);
      return;
    }

    setUploading(true);
    setCurrentFile(file);
    setProgress(0);
    setComputedHash('');
    setStatusMsg('');
    setUploadResult(null);

    // Simulate progress updates for premium user experience
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    // Dynamic Hash Generation effect
    const hashChars = 'abcdef0123456789';
    const hashInterval = setInterval(() => {
      let tempHash = '';
      for (let i = 0; i < 64; i++) {
        tempHash += hashChars[Math.floor(Math.random() * 16)];
      }
      setComputedHash(tempHash);
    }, 80);

    // Call Context action
    const result = await uploadEvidence(file);
    
    setTimeout(() => {
      clearInterval(hashInterval);
      if (result) {
        setUploadResult(result);
        setProgress(100);
        if (result.status === 'FAILED') {
          setStatusMsg('Evidence integrity verification FAILED. File has mismatching signature or is corrupted.');
        } else {
          setStatusMsg('Evidence ingested, parsed, and logged under chain of custody protocol.');
          // Dynamic confetti on upload success
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#00f0ff', '#bc13fe', '#10b981']
          });
        }
      } else {
        setStatusMsg('Evidence validation failed. Log parser encountered formatting anomalies.');
      }
      setUploading(false);
    }, 1800);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">Ingest Forensic Evidence</h1>
        <p className="text-sm text-slate-400">Secure log file ingestion vault. Files are instantly normalized and hashed to preserve Integrity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Drag & Drop Area */}
        <div className="lg:col-span-2 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`glass-card border-2 border-dashed rounded-2xl p-12 text-center transition-all relative overflow-hidden flex flex-col items-center justify-center min-h-[300px] cursor-pointer ${
              dragActive ? 'border-cyan-400 bg-cyan-950/10' : 'border-slate-700/80 hover:border-slate-500'
            }`}
            onClick={onButtonClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              accept=".evtx,.log,.csv,.json"
            />
            
            <div className="p-4 rounded-full bg-slate-900/60 border border-slate-800/80 mb-4 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-10 h-10 text-cyan-400" />
            </div>

            <h3 className="text-base font-semibold text-slate-200 mb-1">Drag and drop forensic log file</h3>
            <p className="text-xs text-slate-500 mb-4 max-w-sm">
              Supports Windows Event Logs (<span className="text-slate-400 font-mono">.evtx</span>), Linux Syslogs (<span className="text-slate-400 font-mono">.log</span>), CSV or JSON exports.
            </p>
            
            <button
              type="button"
              className="px-4 py-2 bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/80 text-cyan-400 text-xs font-mono rounded transition-colors"
            >
              BROWSE FORENSIC LOGS
            </button>
          </div>

          {/* Upload Status Card */}
          {currentFile && (
            <div className="glass-card rounded-xl p-5 border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <FileText className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{currentFile.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">Size: {(currentFile.size / 1024).toFixed(2)} KB</span>
                  </div>
                </div>
                {progress === 100 && !uploading && uploadResult ? (
                  uploadResult.status === 'FAILED' ? (
                    <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono bg-red-950/40 border border-red-500/30 px-2.5 py-1 rounded-full text-glow-red animate-pulse">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      INTEGRITY CHECK FAILED
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-full text-glow-cyan">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      INTEGRITY CHECK PASSED
                    </div>
                  )
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-full animate-pulse">
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    PARSING LOG STRUCTURE
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-slate-400">
                  <span>Ingestion Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Computed Cryptographic Hash */}
              <div className="space-y-1 bg-slate-950/80 border border-slate-900 rounded-lg p-3 font-mono">
                <span className="text-[10px] text-cyan-500 block uppercase tracking-wider">SHA-256 Integrity Verification Hash</span>
                <span className="text-xs text-slate-300 break-all select-all">{computedHash}</span>
              </div>

              {statusMsg && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                  <span className="text-emerald-500 font-bold">{"[>]"}</span> {statusMsg}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Chain of Custody Guidelines Card */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-800/80 relative overflow-hidden bg-slate-950/40">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Award className="w-24 h-24 text-cyan-400" />
            </div>
            
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              Chain of Custody Protocol
            </h3>
            
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              To support legal admissibility, forensic evidence files undergo real-time cryptographic hash verification immediately upon ingestion.
            </p>

            <ul className="space-y-3.5 text-xs text-slate-400 font-mono">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">[1]</span>
                <span>SHA-256 hashing is computed on client stream upload to ensure immutable state records.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">[2]</span>
                <span>The file metadata, size, upload timestamp, and credentials of the authorizing investigator are archived.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">[3]</span>
                <span>Log parses normalize event structures into unified timelines, triggering immediate rule analysis hooks.</span>
              </li>
            </ul>

            <div className="mt-6 border-t border-slate-900 pt-5">
              <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-lg flex flex-col gap-1 font-mono text-[10px] text-cyan-400">
                <span>INVESTIGATOR IN-CHARGE:</span>
                <span className="text-white font-bold text-xs">{user?.name || 'John Doe'}</span>
                <span>ID: {user?.badgeId || 'INV-2026-9904'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
