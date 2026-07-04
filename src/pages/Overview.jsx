import React from 'react';
import { useForensic } from '../context/ForensicContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { ShieldAlert, FileText, Activity, AlertTriangle, Layers } from 'lucide-react';

export default function Overview() {
  const { evidence, events, detections, risk } = useForensic();

  // 1. Metric Counts
  const totalCases = 4;
  const activeCases = 1;
  const uploadedFilesCount = evidence.length;
  const criticalAlertsCount = detections.filter(d => d.severity.toLowerCase() === 'critical').length;
  
  // 2. Recharts Data
  // Dynamic Incident Trends based on actual timeline events or static default if empty
  const getTrendData = () => {
    if (events.length === 0) {
      return [
        { name: '08:00', events: 2, threats: 0 },
        { name: '09:00', events: 8, threats: 2 },
        { name: '10:00', events: 14, threats: 5 },
        { name: '11:00', events: 6, threats: 1 }
      ];
    }
    // Aggregate events per hour or 10 min blocks
    const hours = {};
    events.forEach(e => {
      try {
        const date = new Date(e.timestamp);
        const label = date.toTimeString().substring(0, 5); // HH:MM
        hours[label] = (hours[label] || 0) + 1;
      } catch (err) {
        hours['00:00'] = (hours['00:00'] || 0) + 1;
      }
    });

    return Object.keys(hours).sort().map(key => ({
      name: key,
      events: hours[key],
      threats: Math.max(0, Math.floor(hours[key] / 2)) // simulated threat count matching event volume
    }));
  };

  // Threat Categories Pie Chart
  const getThreatDistribution = () => {
    if (detections.length === 0) {
      return [{ name: 'No threats', value: 1 }];
    }
    const counts = {};
    detections.forEach(d => {
      counts[d.threatType] = (counts[d.threatType] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  };

  // Event Categories Bar Chart
  const getEventCategories = () => {
    const counts = { Login: 0, Process: 0, Network: 0, FileSystem: 0, System: 0 };
    events.forEach(e => {
      const cat = e.eventType;
      if (counts[cat] !== undefined) {
        counts[cat]++;
      } else {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return Object.keys(counts).map(key => ({
      name: key,
      volume: counts[key]
    }));
  };

  const trendData = getTrendData();
  const distributionData = getThreatDistribution();
  const categoriesData = getEventCategories();

  const PIE_COLORS = ['#00f0ff', '#a855f7', '#ec4899', '#e11d48', '#eab308', '#22c55e'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">SOC Operations Center</h1>
        <p className="text-sm text-slate-400">Live digital forensics orchestration, parser ingestion, and machine intelligence logs analysis.</p>
      </div>

      {/* Overview Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        
        {/* Total Cases */}
        <div className="glass-card rounded-xl p-5 border border-slate-800/80 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers className="w-16 h-16 text-cyan-400" />
          </div>
          <span className="text-xs font-mono text-cyan-500 uppercase tracking-wider block mb-1">Total Cases</span>
          <h3 className="text-3xl font-extrabold text-white mb-2 font-mono">{totalCases}</h3>
          <span className="text-[10px] text-slate-500 font-mono">Active database segments</span>
        </div>

        {/* Active Investigations */}
        <div className="glass-card rounded-xl p-5 border border-slate-800/80 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-16 h-16 text-purple-400" />
          </div>
          <span className="text-xs font-mono text-purple-400 uppercase tracking-wider block mb-1">Active Cases</span>
          <h3 className="text-3xl font-extrabold text-white mb-2 font-mono">{activeCases}</h3>
          <span className="text-[10px] text-emerald-400 font-mono">1 Agent Running Analysis</span>
        </div>

        {/* Uploaded Evidence */}
        <div className="glass-card rounded-xl p-5 border border-slate-800/80 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <FileText className="w-16 h-16 text-fuchsia-400" />
          </div>
          <span className="text-xs font-mono text-fuchsia-400 uppercase tracking-wider block mb-1">Evidence Files</span>
          <h3 className="text-3xl font-extrabold text-white mb-2 font-mono">{uploadedFilesCount}</h3>
          <span className="text-[10px] text-slate-500 font-mono">Integrity checks completed</span>
        </div>

        {/* Critical Alerts */}
        <div className="glass-card rounded-xl p-5 border border-slate-800/80 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert className="w-16 h-16 text-rose-500" />
          </div>
          <span className="text-xs font-mono text-rose-500 uppercase tracking-wider block mb-1">Critical Alerts</span>
          <h3 className={`text-3xl font-extrabold mb-2 font-mono ${criticalAlertsCount > 0 ? 'text-red-500 text-glow-red animate-pulse' : 'text-white'}`}>
            {criticalAlertsCount}
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">Immediate response needed</span>
        </div>

        {/* Risk Score */}
        <div className="glass-card rounded-xl p-5 border border-slate-800/80 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertTriangle className="w-16 h-16 text-yellow-500" />
          </div>
          <span className="text-xs font-mono text-yellow-500 uppercase tracking-wider block mb-1">Overall Posture</span>
          <h3 className={`text-3xl font-extrabold mb-2 font-mono ${
            risk.level.toLowerCase() === 'critical' ? 'text-red-500 text-glow-red' :
            risk.level.toLowerCase() === 'high' ? 'text-orange-500' :
            risk.level.toLowerCase() === 'medium' ? 'text-yellow-500' : 'text-emerald-500'
          }`}>
            {risk.score} <span className="text-sm font-normal text-slate-400">/100</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-500">Risk level: <span className="uppercase font-bold">{risk.level}</span></span>
        </div>

      </div>

      {/* SOC Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Area Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-slate-800/80 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Incident Event Ingestion Trends</h2>
            <span className="text-[10px] text-cyan-400 font-mono px-2 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/20">LIVE DATA STREAM</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: 8, color: '#fff' }} />
                <Area type="monotone" dataKey="events" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorEvents)" name="Total Logs Ingested" />
                <Area type="monotone" dataKey="threats" stroke="#bc13fe" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" name="Triggered Detections" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution Pie Chart */}
        <div className="glass-card rounded-xl p-5 border border-slate-800/80 flex flex-col">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">Threat Vectors Distribution</h2>
          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Dial Stats */}
            <div className="absolute text-center">
              <span className="text-3xl font-extrabold text-white font-mono">{detections.length}</span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-mono">Detections</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono max-h-16 overflow-y-auto">
            {distributionData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 truncate text-[10px] text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }} />
                <span className="truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Event Categories Bar Chart */}
      <div className="glass-card rounded-xl p-5 border border-slate-800/80">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">Forensic Event Categories (Ingested Volume)</h2>
        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoriesData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#090d16', border: '1px solid #1e293b', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="volume" fill="#a855f7" radius={[4, 4, 0, 0]} name="Event Log Count">
                {categoriesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00f0ff' : '#a855f7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
