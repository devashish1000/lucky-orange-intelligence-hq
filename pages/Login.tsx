
import React, { useState } from 'react';
import { useAuth, useUI } from '../App';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, ShieldCheck, Eye, EyeOff, Sparkles, ChevronRight } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const { triggerHaptic, showToast } = useUI();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the intended path from router state or default to dashboard
  const from = (location.state as any)?.from?.pathname || '/';

  const [email, setEmail] = useState('growth@luckyorange.com');
  const [password, setPassword] = useState('orange2025');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    triggerHaptic('medium');

    // Simulate authentication processing
    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        triggerHaptic('success');
        showToast("Access Granted");
        // Redirect to intended route or dashboard
        navigate(from, { replace: true });
      } else {
        setError('Authentication Failed: Invalid Terminal Key');
        setIsLoading(false);
        triggerHaptic('error');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--ios-bg)] flex flex-col items-center justify-center p-6 safe-top safe-bottom animate-in fade-in duration-500">
      <div className="w-full max-w-[400px]">
        {/* Branding Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#FF9500] to-[#FFCC00] rounded-[18px] flex items-center justify-center text-white shadow-xl shadow-[#FF9500]/20 animate-in zoom-in-95 duration-700">
              <Sparkles size={32} fill="white" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[28px] font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Lucky Orange</span>
              <span className="px-2 py-0.5 bg-[#FF9500]/10 text-[#FF9500] text-[10px] font-black rounded-md uppercase tracking-widest">HQ</span>
            </div>
            <p className="headline text-[rgba(60,60,67,0.5)] font-medium">Growth & Intelligence Intelligence HQ</p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="glass p-8 rounded-[28px] border-none shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#FF9500] to-[#FFCC00]"></div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="caption-2 ml-1 opacity-60">Admin Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text opacity-40">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-11 pr-4 bg-[rgba(120,120,128,0.08)] border-none rounded-[16px] headline !font-normal focus:bg-white dark:focus:bg-[#1C1C1E] focus:ring-2 focus:ring-[#FF9500]/30 transition-all outline-none" 
                  placeholder="your@luckyorange.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline pr-1">
                <label className="caption-2 ml-1 opacity-60">Terminal Key</label>
                <button type="button" onClick={() => showToast("Contact admin for reset")} className="text-[11px] font-bold text-[#007AFF] tap-feedback">Forgot Key?</button>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-text opacity-40">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-11 pr-12 bg-[rgba(120,120,128,0.08)] border-none rounded-[16px] headline !font-normal focus:bg-white dark:focus:bg-[#1C1C1E] focus:ring-2 focus:ring-[#FF9500]/30 transition-all outline-none" 
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-text opacity-40 hover:opacity-100 transition-opacity"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 py-1 px-1">
              <input 
                type="checkbox" 
                id="remember" 
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="w-4 h-4 rounded-md accent-[#FF9500]"
              />
              <label htmlFor="remember" className="text-[13px] font-medium opacity-70 cursor-pointer">Remember terminal for 30 days</label>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-[#FF3B30] p-3 bg-[#FF3B30]/5 rounded-[12px] border border-[#FF3B30]/10 animate-in shake duration-300">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span className="headline text-[13px] font-bold leading-tight">{error}</span>
              </div>
            )}

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-14 primary-button !bg-gradient-to-r from-[#FF9500] to-[#FF6B00] tap-feedback flex items-center justify-center gap-2 shadow-xl shadow-[#FF9500]/20"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                  <div className="flex items-center gap-2">
                    Initialize HQ Terminal <ChevronRight size={18} />
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-6">
            <button className="text-[13px] font-bold opacity-40 hover:opacity-100 transition-opacity tap-feedback">Single Sign-On (SSO)</button>
            <div className="w-[1px] h-3 bg-[rgba(120,120,128,0.2)]"></div>
            <button className="text-[13px] font-bold opacity-40 hover:opacity-100 transition-opacity tap-feedback">System Status</button>
          </div>
          <p className="caption-2 opacity-30 text-[10px]">
            LUCKY ORANGE SECURE ACCESS • VERSION 2.5 • © 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
