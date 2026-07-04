import React, { useState } from 'react';
import { useForensic } from '../context/ForensicContext';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Terminal, Loader2 } from 'lucide-react';

export default function Login() {
  const { login, setActivePage } = useForensic();
  const [email, setEmail] = useState('investigator@logforx.local');
  const [password, setPassword] = useState('cybersecurity2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all security fields.');
      return;
    }

    setLoading(true);
    // Simulate connection delay for premium feel
    setTimeout(async () => {
      try {
        const success = await login(email, password);
        if (success) {
          if (rememberMe) {
            localStorage.setItem('remember_email', email);
          } else {
            localStorage.removeItem('remember_email');
          }
        }
      } catch (err) {
        setError('Access Denied: Invalid credentials or expired authorization token.');
      } finally {
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-[#030712] cyber-grid cyber-scanline px-4">
      {/* Background Neon Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Glassmorphic Login Card */}
      <div className="w-full max-w-md glass-card rounded-2xl p-8 relative overflow-hidden border border-slate-800/80">
        
        {/* Secure session indicator */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30">
              <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wider m-0 leading-none">LOGFORX</h1>
              <span className="text-[10px] text-cyan-500 font-mono tracking-widest uppercase">Digital Forensics</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            SECURE SESSION
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-1">Authorization Required</h2>
          <p className="text-sm text-slate-400">Provide your investigator keys to decrypt the platform.</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-400 flex items-start gap-2 animate-pulse">
            <span className="font-mono font-bold">[!]</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-mono text-cyan-500 uppercase tracking-wider mb-2">Investigator Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investigator@logforx.local"
                className="w-full glass-input rounded-lg py-3 pl-10 pr-4 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-mono text-cyan-500 uppercase tracking-wider">Security Password</label>
              <button
                type="button"
                onClick={() => setActivePage('forgot-password')}
                className="text-xs text-purple-400 hover:text-purple-300 font-mono transition-colors"
                disabled={loading}
              >
                Forgot Keys?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full glass-input rounded-lg py-3 pl-10 pr-10 text-sm"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="sr-only peer"
                disabled={loading}
              />
              <div className="w-4 h-4 rounded border border-slate-700 bg-slate-900/60 peer-checked:bg-cyan-500 peer-checked:border-cyan-500 flex items-center justify-center transition-all">
                <div className="w-2 h-2 bg-[#030712] rounded-xs opacity-0 peer-checked:opacity-100" />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors font-mono">Maintain Session</span>
            </label>
            <span className="text-[10px] text-slate-500 font-mono">TLS 1.3 AES-256</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full relative overflow-hidden py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-sm font-semibold tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/30 cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>DECRYPTING VAULT...</span>
              </>
            ) : (
              <span>ESTABLISH UPLINK</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-900 pt-4 flex flex-col gap-2">
          <span className="text-[10px] text-slate-600 font-mono tracking-widest uppercase block mb-1">
            DEMO: investigator@logforx.local / cybersecurity2026
          </span>
          <button
            type="button"
            onClick={() => setActivePage('register')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors cursor-pointer"
            disabled={loading}
          >
            Create Investigator Account
          </button>
        </div>
      </div>
    </div>
  );
}
