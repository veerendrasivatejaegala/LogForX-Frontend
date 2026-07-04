import React, { useState, useEffect } from 'react';
import { useForensic } from '../context/ForensicContext';
import { Network, Terminal, ShieldAlert, Cpu, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AttackGraph() {
  const { attackGraph, detections } = useForensic();
  const [selectedNode, setSelectedNode] = useState(null);

  // Nodes from state or default sequence
  const nodes = attackGraph.nodes && attackGraph.nodes.length > 0 ? attackGraph.nodes : [
    { id: "1", label: "Initial Log Entry", type: "System", severity: "Low", description: "Log ingestion monitor activated." }
  ];
  
  const links = attackGraph.links || [];

  useEffect(() => {
    if (nodes.length > 0 && !selectedNode) {
      setSelectedNode(nodes[nodes.length - 1]); // default to latest event node
    }
  }, [nodes]);

  const getNodeColor = (severity) => {
    if (!severity) return '#1e293b';
    switch (severity.toLowerCase()) {
      case 'critical': return '#ef4444'; // Red
      case 'high': return '#f97316'; // Orange
      case 'medium': return '#eab308'; // Yellow
      default: return '#06b6d4'; // Cyan
    }
  };

  const getShadowColor = (severity) => {
    if (!severity) return 'rgba(30, 41, 59, 0.4)';
    switch (severity.toLowerCase()) {
      case 'critical': return 'rgba(239, 68, 68, 0.4)';
      case 'high': return 'rgba(249, 115, 22, 0.3)';
      case 'medium': return 'rgba(234, 179, 8, 0.3)';
      default: return 'rgba(6, 182, 212, 0.3)';
    }
  };

  // Determine standard layout positions
  const layoutNodes = nodes.map((node, i) => {
    // Lay out horizontally or staggered
    const x = 70 + i * 140;
    const y = 140 + (i % 2 === 0 ? -40 : 40);
    return { ...node, x, y };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">Visual Attack Chain Path</h1>
        <p className="text-sm text-slate-400">Node-based logical reconstruction showing threat progression across network components.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Attack Graph Node Board */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5 border border-slate-800/80 bg-slate-950/40">
          <div className="flex justify-between items-center mb-4 border-b border-slate-900 pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              Adversary Progression Flow Map
            </h2>
            <span className="text-[10px] text-slate-500 font-mono">CLICK NODES TO TRACE</span>
          </div>

          {/* SVG Canvas Board */}
          <div className="w-full overflow-x-auto border border-slate-900 rounded-lg bg-slate-950/90 relative p-4 scrollbar-thin">
            
            {/* Grid coordinates effect */}
            <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
            
            <svg width={Math.max(680, layoutNodes.length * 150)} height="300" className="relative z-10 mx-auto">
              
              {/* Draw Connector Links */}
              {layoutNodes.map((node, i) => {
                if (i === 0) return null;
                const prevNode = layoutNodes[i - 1];
                
                // Draw bezier line connector
                const path = `M ${prevNode.x} ${prevNode.y} C ${(prevNode.x + node.x) / 2} ${prevNode.y}, ${(prevNode.x + node.x) / 2} ${node.y}, ${node.x} ${node.y}`;
                
                return (
                  <g key={`link-${i}`}>
                    <path
                      d={path}
                      fill="none"
                      stroke={getNodeColor(node.severity)}
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      className="opacity-40 animate-pulse"
                    />
                    {/* Glowing flow pointer */}
                    <circle r="4" fill={getNodeColor(node.severity)}>
                      <animateMotion dur="4s" repeatCount="indefinite" path={path} />
                    </circle>
                  </g>
                );
              })}

              {/* Draw Nodes */}
              {layoutNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const color = getNodeColor(node.severity);
                const glow = getShadowColor(node.severity);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNode(node)}
                  >
                    {/* Glow outline circle */}
                    <circle
                      r="26"
                      fill="transparent"
                      stroke={isSelected ? color : 'transparent'}
                      strokeWidth="2.5"
                      style={{ filter: `drop-shadow(0 0 8px ${color})` }}
                      className="transition-all duration-300"
                    />

                    {/* Main Node Circle background */}
                    <circle
                      r="20"
                      fill="#090d16"
                      stroke={color}
                      strokeWidth="2"
                      className="transition-transform group-hover:scale-105"
                      style={{ boxShadow: `0 0 10px ${glow}` }}
                    />

                    {/* Node stage number */}
                    <text
                      textAnchor="middle"
                      dy=".3em"
                      fill="#fff"
                      fontSize="10"
                      fontWeight="bold"
                      className="font-mono"
                    >
                      S{node.id}
                    </text>

                    {/* Text labels below */}
                    <text
                      textAnchor="middle"
                      y="40"
                      fill={isSelected ? color : '#94a3b8'}
                      fontSize="9"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="font-mono select-none"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}

            </svg>

          </div>
        </div>

        {/* Selected Node Details Side drawer */}
        <div className="space-y-6">
          {selectedNode ? (
            <div className="glass-card rounded-xl p-5 border border-slate-800/80 space-y-4">
              <div className="border-b border-slate-900 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Chain Inspector</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Stage {selectedNode.id} of intrusion flow</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase font-mono ${
                  selectedNode.severity?.toLowerCase() === 'critical' ? 'border-red-500/50 bg-red-950/40 text-red-400' :
                  selectedNode.severity?.toLowerCase() === 'high' ? 'border-orange-500/50 bg-orange-950/40 text-orange-400' :
                  selectedNode.severity?.toLowerCase() === 'medium' ? 'border-yellow-500/50 bg-yellow-950/40 text-yellow-400' :
                  'border-cyan-500/50 bg-cyan-950/40 text-cyan-400'
                }`}>
                  {selectedNode.severity || 'LOW'}
                </span>
              </div>

              <div className="space-y-3.5 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-cyan-500 block uppercase">Intrusion Milestone</span>
                  <span className="text-slate-200 block font-semibold text-sm">{selectedNode.label}</span>
                </div>

                <div>
                  <span className="text-[10px] text-cyan-500 block uppercase">Adversary Tactics Category</span>
                  <span className="text-slate-300 block font-semibold">{selectedNode.type} Stage</span>
                </div>

                <div>
                  <span className="text-[10px] text-cyan-500 block uppercase">Milestone Description</span>
                  <p className="text-slate-400 leading-relaxed font-sans mt-1 text-xs">
                    {selectedNode.description}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-8 border border-slate-800/80 text-center text-slate-500 text-xs">
              Select an attack graph node from the flow canvas to view intrusion details and mitigations.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
