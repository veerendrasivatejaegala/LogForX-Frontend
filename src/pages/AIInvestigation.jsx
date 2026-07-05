import React, { useState, useRef, useEffect } from 'react';
import { useForensic } from '../context/ForensicContext';
import { Cpu, Send, ShieldCheck, Terminal, HelpCircle, Loader2, AlertTriangle, Zap, Brain } from 'lucide-react';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

// Build a forensic context summary from real application data
function buildForensicContext(detections, events, evidence, iocs) {
  const parts = [];

  if (detections?.length > 0) {
    parts.push('=== ACTIVE THREAT DETECTIONS ===');
    detections.slice(0, 20).forEach(d => {
      parts.push(`[${d.severity}] ${d.threatType} — ${d.description} | MITRE: ${d.mitreTechnique}`);
    });
  }

  if (events?.length > 0) {
    parts.push('\n=== RECENT FORENSIC EVENTS (last 25) ===');
    events.slice(-25).forEach(e => {
      parts.push(`[${e.severity}] ${e.action} | Source: ${e.source} | IP: ${e.ipAddress} | User: ${e.username} | ${e.payloadDetails?.substring(0, 120) || ''}`);
    });
  }

  if (evidence?.length > 0) {
    parts.push('\n=== EVIDENCE FILES ===');
    evidence.forEach(e => {
      parts.push(`${e.fileName} (${e.fileType}) — Status: ${e.status} — Hash: ${e.hash?.substring(0, 16)}...`);
    });
  }

  if (iocs?.length > 0) {
    parts.push('\n=== INDICATORS OF COMPROMISE ===');
    iocs.forEach(i => {
      parts.push(`[${i.type}] ${i.value || i.iocValue} — ${i.description}`);
    });
  }

  return parts.join('\n');
}

async function callOpenRouterAI(messages, forensicContext) {
  if (!OPENROUTER_API_KEY) {
    return '⚠️ AI API key not configured. Set VITE_OPENROUTER_API_KEY in your .env file.';
  }

  const systemPrompt = `You are LogForX AI Forensic Copilot — a senior digital forensics & incident response (DFIR) analyst AI embedded in a Security Operations Center platform.

You have direct access to the live forensic data from the current investigation. Here is the real-time telemetry:

${forensicContext}

INSTRUCTIONS:
- Analyze the above real forensic data when answering questions.
- Reference specific IPs, usernames, event IDs, MITRE techniques, and IOCs from the data.
- Provide actionable, technical DFIR responses — not generic advice.
- Map findings to MITRE ATT&CK framework where applicable.
- When asked for recommendations, give specific containment, eradication, and recovery steps.
- Use a professional SOC analyst tone. Be concise but thorough.
- Format responses with clear structure using bullet points where helpful.
- If asked about attacks not present in the data, say so honestly.`;

  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }))
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'LogForX Digital Forensics Platform'
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-small-2603',
      messages: apiMessages,
      max_tokens: 1024,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('[AI] OpenRouter error:', response.status, err);
    return `⚠️ AI service error (${response.status}). ${err?.substring(0, 200) || 'Check your API key and try again.'}`;
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated. Please try again.';
}

export default function AIInvestigation() {
  const { aiData, detections, events, evidence, iocs } = useForensic();
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '🔒 **LogForX AI Forensic Copilot Online.**\n\nI have synchronized with your live forensic databases — evidence files, threat detections, timeline events, and IOCs are loaded into my analysis context.\n\nAsk me anything about the active intrusion, attack patterns, compromised assets, or remediation strategies.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatLoading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || chatLoading) return;

    const userMessage = { sender: 'user', text: inputValue };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setChatLoading(true);

    try {
      const forensicContext = buildForensicContext(detections, events, evidence, iocs);
      const aiResponse = await callOpenRouterAI(updatedMessages, forensicContext);
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    } catch (error) {
      console.error('[AI] Request failed:', error);
      setMessages(prev => [...prev, { sender: 'ai', text: `⚠️ Connection error: ${error.message}. Ensure your network can reach OpenRouter.` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const samplePrompts = [
    "Analyze the current threats and rank by severity",
    "What user accounts were compromised in this attack?",
    "Map the full kill chain from initial access to exfiltration",
    "What IOCs should I block immediately?",
    "Give me a step-by-step incident response plan",
    "Explain the MITRE ATT&CK techniques used in this intrusion"
  ];

  const apiStatus = OPENROUTER_API_KEY ? 'LIVE' : 'NOT CONFIGURED';
  const statusColor = OPENROUTER_API_KEY ? 'text-emerald-400' : 'text-red-400';
  const statusDot = OPENROUTER_API_KEY ? 'bg-emerald-500' : 'bg-red-500';

  // Simple markdown-ish rendering for AI responses
  const renderMessageText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      // Bold
      let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-300">$1</strong>');
      // Bullet points
      if (rendered.trim().startsWith('- ') || rendered.trim().startsWith('• ')) {
        return <div key={i} className="pl-3 py-0.5" dangerouslySetInnerHTML={{ __html: '• ' + rendered.replace(/^[-•]\s*/, '') }} />;
      }
      if (rendered.trim() === '') return <br key={i} />;
      return <div key={i} className="py-0.5" dangerouslySetInnerHTML={{ __html: rendered }} />;
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono flex items-center gap-3">
          <Brain className="w-7 h-7 text-cyan-400" />
          AI Forensic Copilot
        </h1>
        <p className="text-sm text-slate-400 mt-1">Real-time AI-powered forensic analysis connected to your live evidence, threat detections, and IOCs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* AI Structural Insights */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-card rounded-xl p-5 border border-slate-800/80 bg-slate-950/40 space-y-4 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="border-b border-slate-900 pb-3 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Structural Analysis</h3>
              </div>

              <div>
                <span className="text-[10px] text-cyan-500 font-mono block uppercase">Incident Summary</span>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">{aiData.incidentSummary || "Upload evidence files to generate an AI-powered incident summary."}</p>
              </div>

              <div>
                <span className="text-[10px] text-cyan-500 font-mono block uppercase">Root Cause Identification</span>
                <p className="text-xs text-slate-300 leading-relaxed mt-1 font-semibold">{aiData.rootCause || "N/A"}</p>
              </div>

              <div>
                <span className="text-[10px] text-cyan-500 font-mono block uppercase">Remediation Roadmap</span>
                <ul className="list-disc pl-4 text-xs text-slate-400 leading-relaxed mt-1.5 space-y-2">
                  {aiData.recommendations && aiData.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Live Data Stats */}
              <div className="border-t border-slate-900 pt-3 space-y-2">
                <span className="text-[10px] text-cyan-500 font-mono block uppercase">AI Context Data</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-800/50">
                    <div className="text-lg font-bold text-cyan-400 font-mono">{detections?.length || 0}</div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">Threats</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-800/50">
                    <div className="text-lg font-bold text-purple-400 font-mono">{events?.length || 0}</div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">Events</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-800/50">
                    <div className="text-lg font-bold text-amber-400 font-mono">{evidence?.length || 0}</div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">Evidence</div>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 text-center border border-slate-800/50">
                    <div className="text-lg font-bold text-red-400 font-mono">{iocs?.length || 0}</div>
                    <div className="text-[9px] text-slate-500 uppercase font-mono">IOCs</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900">
              <div className={`flex items-center gap-1.5 text-[10px] font-mono ${statusColor}`}>
                <span className={`w-2 h-2 rounded-full ${statusDot} ${OPENROUTER_API_KEY ? 'animate-pulse' : ''}`} />
                <ShieldCheck className="w-4 h-4" />
                AI ENGINE {apiStatus} — OPENROUTER
              </div>
            </div>
          </div>
        </div>

        {/* AI Assistant Chat Panel */}
        <div className="lg:col-span-2 glass-card rounded-xl border border-slate-800/80 flex flex-col h-[520px] overflow-hidden">
          
          {/* Chat Panel Header */}
          <div className="p-4 bg-slate-950/80 border-b border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">Forensic Copilot Terminal</span>
              {OPENROUTER_API_KEY && (
                <span className="text-[9px] font-mono bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  <Zap className="w-3 h-3 inline-block mr-0.5" />LIVE AI
                </span>
              )}
            </div>
            <span className={`w-2.5 h-2.5 rounded-full ${statusDot} shadow-lg animate-pulse`} />
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div className={`p-1 rounded shrink-0 h-6 w-6 flex items-center justify-center font-bold border ${
                  msg.sender === 'user' ? 'bg-purple-950 border-purple-500/30 text-purple-400' : 'bg-cyan-950 border-cyan-500/30 text-cyan-400'
                }`}>
                  {msg.sender === 'user' ? 'INV' : 'AI'}
                </div>
                
                <div className={`p-3.5 rounded-lg leading-relaxed ${
                  msg.sender === 'user' ? 'bg-purple-950/30 border border-purple-500/20 text-purple-200' : 'bg-slate-900/60 border border-slate-800 text-slate-300'
                }`}>
                  {msg.sender === 'ai' ? renderMessageText(msg.text) : msg.text}
                </div>
              </div>
            ))}
            
            {chatLoading && (
              <div className="flex gap-3 max-w-[85%]">
                <div className="p-1 rounded shrink-0 h-6 w-6 flex items-center justify-center font-bold border bg-cyan-950 border-cyan-500/30 text-cyan-400">
                  AI
                </div>
                <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  Analyzing forensic data with AI model...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Sample prompts */}
          <div className="px-4 py-2 border-t border-slate-900 bg-slate-950/20 max-h-16 overflow-y-auto flex flex-wrap gap-2 items-center">
            <span className="text-[9px] font-mono text-slate-500 flex items-center gap-0.5 uppercase">
              <HelpCircle className="w-3 h-3" /> SUGGESTIONS:
            </span>
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => setInputValue(prompt)}
                className="text-[9px] font-mono text-cyan-400/80 hover:text-cyan-300 bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-500/40 px-2 py-0.5 rounded cursor-pointer transition-colors max-w-xs truncate"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Form Inbound Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-900 bg-slate-950/60 flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={OPENROUTER_API_KEY ? "Ask the AI Copilot about your investigation..." : "⚠️ Set VITE_OPENROUTER_API_KEY in .env to enable AI"}
              className="flex-1 glass-input rounded-lg px-4 py-2.5 text-xs font-mono"
              disabled={chatLoading}
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold tracking-wider transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              disabled={chatLoading || !OPENROUTER_API_KEY}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
