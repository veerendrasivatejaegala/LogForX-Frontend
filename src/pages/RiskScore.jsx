import React from 'react';
import { useForensic } from '../context/ForensicContext';
import { ShieldCheck, ShieldAlert, Zap, Lock, Network, Database } from 'lucide-react';

export default function RiskScore() {
  const { risk, detections } = useForensic();
  
  // Calculate SVG circular parameters
  const score = risk.score;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getRiskColor = (level) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'text-red-500 stroke-red-500';
      case 'high': return 'text-orange-500 stroke-orange-500';
      case 'medium': return 'text-yellow-500 stroke-yellow-500';
      default: return 'text-emerald-400 stroke-emerald-400';
    }
  };

  const getRiskTextGlow = (level) => {
    switch (level.toLowerCase()) {
      case 'critical': return 'text-glow-red';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-glow-cyan';
    }
  };

  const activeDetectionsCount = detections.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">Platform Threat Risk Score</h1>
        <p className="text-sm text-slate-400">Security posture calculation updated dynamically as forensic log evidence is ingested.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Radial Risk Meter */}
        <div className="glass-card rounded-xl p-6 border border-slate-800/80 bg-slate-950/40 flex flex-col items-center justify-center text-center">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-6">Security Posture Dial</h2>
          
          <div className="relative flex items-center justify-center mb-6">
            <svg className="w-52 h-52 transform -rotate-90">
              {/* Outer background circle */}
              <circle
                cx="104"
                cy="104"
                r={radius}
                className="stroke-slate-900 fill-transparent"
                strokeWidth="12"
              />
              {/* Foreground glowing stroke circle */}
              <circle
                cx="104"
                cy="104"
                r={radius}
                className={`fill-transparent transition-all duration-1000 ease-out ${getRiskColor(risk.level)}`}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 8px rgba(6,182,212,0.3))` }}
              />
            </svg>

            {/* Center Text displaying numbers */}
            <div className="absolute text-center">
              <span className={`text-5xl font-extrabold font-mono block leading-none ${getRiskTextGlow(risk.level)}`}>
                {score}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono mt-1">Risk Score</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-mono uppercase">Calculated Severity Level</span>
            <h3 className={`text-xl font-bold uppercase tracking-wider ${
              risk.level.toLowerCase() === 'critical' ? 'text-red-500 text-glow-red animate-pulse' :
              risk.level.toLowerCase() === 'high' ? 'text-orange-500' :
              risk.level.toLowerCase() === 'medium' ? 'text-yellow-500' : 'text-emerald-400'
            }`}>
              {risk.level}
            </h3>
          </div>
        </div>

        {/* Threat Factors Breakdown */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">Risk Breakdown & Vectors</h2>
            
            <div className="space-y-4 font-mono text-xs">
              
              {/* Credential Exposure */}
              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Credential Access Vectors</h4>
                    <p className="text-[10px] text-slate-500">Failed authentication thresholds, SSH/RDP dictionary campaigns</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  risk.criticalCount > 0 ? 'bg-red-950/60 border border-red-500/30 text-red-400' : 'bg-slate-950 text-slate-500'
                }`}>
                  {risk.criticalCount > 0 ? 'EXPOSED' : 'NORMAL'}
                </span>
              </div>

              {/* Malicious Code execution */}
              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-950/40 border border-purple-500/20 text-purple-400 rounded">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Script Execution Vectors</h4>
                    <p className="text-[10px] text-slate-500">Obfuscated PowerShell spawns, service installer scripts</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  risk.highCount > 0 ? 'bg-orange-950/60 border border-orange-500/30 text-orange-400' : 'bg-slate-950 text-slate-500'
                }`}>
                  {risk.highCount > 0 ? 'TRIGGERED' : 'NORMAL'}
                </span>
              </div>

              {/* Data Exfiltration Threat */}
              <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-fuchsia-950/40 border border-fuchsia-500/20 text-fuchsia-400 rounded">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Data Integrity & Exfiltration</h4>
                    <p className="text-[10px] text-slate-500">Target archive bundling, socket uploads to remote malicious ranges</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                  risk.score > 70 ? 'bg-red-950/60 border border-red-500/30 text-red-400 text-glow-red animate-pulse' : 'bg-slate-950 text-slate-500'
                }`}>
                  {risk.score > 70 ? 'CRITICAL RISK' : 'SECURE'}
                </span>
              </div>

            </div>
          </div>

          <div className="pt-5 border-t border-slate-900 mt-4 flex items-center justify-between font-mono text-[10px] text-slate-500">
            <span>PLATFORM COMPLIANCE LEVEL:</span>
            <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> ISO-27001 SECURED
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
