import React, { useState } from 'react';
import { useForensic } from '../context/ForensicContext';
import { Lock, Mail, User, ShieldCheck, Terminal, Loader2, Award } from 'lucide-react';

export default function Register() {
  const { register, setActivePage } = useForensic();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [badgeId, setBadgeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!name || !email || !badgeId || !password) {
      setError('All credential registration fields are required.');
      return;
    }

    setLoading(true);
    // Simulate connection delay for premium feel
    setTimeout(async () => {
      try {
        const res = await register(email, password, name, badgeId);
        setSuccess(res.message || 'Credentials created successfully. Redirecting...');
        setTimeout(() => {
          setActivePage('login');
        }, 1500);
      } catch (err) {
        setError(err.message || 'Registration Denied: Check server constraints.');
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

      {/* Main Glassmorphic Card */}
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
            SECURE LINK
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-100 mb-1">Create Account</h2>
          <p className="text-sm text-slate-400">Register new investigator credentials in the local registry.</p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-400 flex items-start gap-2 animate-pulse">
            <span className="font-mono font-bold">[!]</span>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-400 flex items-start gap-2">
            <span className="font-mono font-bold">[✓]</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-mono text-cyan-500 uppercase tracking-wider mb-1.5">Investigator Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full glass-input rounded-lg py-2.5 pl-10 pr-4 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Badge ID */}
          <div>
            <label className="block text-xs font-mono text-cyan-500 uppercase tracking-wider mb-1.5">Badge Identifier</label>
            <div className="relative">
              <Award className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={badgeId}
                onChange={(e) => setBadgeId(e.target.value)}
                placeholder="INV-2026-9904"
                className="w-full glass-input rounded-lg py-2.5 pl-10 pr-4 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-xs font-mono text-cyan-500 uppercase tracking-wider mb-1.5">Investigator Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="investigator@logforx.local"
                className="w-full glass-input rounded-lg py-2.5 pl-10 pr-4 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-mono text-cyan-500 uppercase tracking-wider mb-1.5">Security Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full glass-input rounded-lg py-2.5 pl-10 pr-10 text-sm"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full relative overflow-hidden py-3 mt-2 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white text-sm font-semibold tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/30 cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>SAVING IDENTITIES...</span>
              </>
            ) : (
              <span>REGISTER IDENTITY</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-slate-900 pt-4 flex flex-col gap-2">
          <button
            onClick={() => setActivePage('login')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono transition-colors cursor-pointer"
            disabled={loading}
          >
            Return to Login
          </button>
        </div>
      </div>
    </div>
  );
}
