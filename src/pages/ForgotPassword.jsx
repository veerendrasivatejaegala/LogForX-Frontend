import React, { useState } from 'react';
import { useForensic } from '../context/ForensicContext';
import { Mail, Terminal, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../utils/api';

export default function ForgotPassword() {
  const { setActivePage } = useForensic();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    
    // Simulate delay
    setTimeout(async () => {
      try {
        await api.forgotPassword(email);
        setSuccess(true);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-[#030712] cyber-grid cyber-scanline px-4">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md glass-card rounded-2xl p-8 relative overflow-hidden border border-slate-800/80">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30">
            <Terminal className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wider m-0 leading-none">LOGFORX</h1>
            <span className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">Digital Forensics</span>
          </div>
        </div>

        {success ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">Decrypt Request Issued</h2>
            <p className="text-sm text-slate-400 mb-6">
              A recovery link with configuration keys has been issued to <span className="text-cyan-400 font-mono">{email}</span>.
            </p>
            <button
              onClick={() => setActivePage('reset-password')}
              className="w-full py-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900/80 text-cyan-400 text-sm font-semibold tracking-wider transition-colors mb-3 cursor-pointer"
            >
              PROCEED TO RESET PASSCODE
            </button>
            <button
              onClick={() => setActivePage('login')}
              className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-300 mx-auto transition-colors mt-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Authentication Portal
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-100 mb-1 font-mono">Recover Credentials</h2>
              <p className="text-sm text-slate-400 font-sans">
                Submit your registered email address. We will route authentication hashes to configure a new passcode.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-cyan-500 uppercase tracking-wider mb-2">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="investigator@logforx.local"
                    className="w-full glass-input rounded-lg py-3 pl-10 pr-4 text-sm"
                    disabled={loading}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-sm font-semibold tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>ISSUING LINK...</span>
                  </>
                ) : (
                  <span>TRANSMIT RECOVERY KEY</span>
                )}
              </button>
            </form>

            <button
              onClick={() => setActivePage('login')}
              className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-300 mx-auto transition-colors mt-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Authentication Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
