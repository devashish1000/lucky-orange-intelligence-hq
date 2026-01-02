
import React, { useState } from 'react';
import { useAuth } from '../App';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('growth@luckyorange.com');
  const [password, setPassword] = useState('orange2025');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(15);

    setTimeout(() => {
      const success = login(email, password);
      if (!success) {
        setError('Authentication Failed');
        setIsLoading(false);
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([20, 10, 20]);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--ios-bg)] flex flex-col items-center justify-center p-6 safe-top safe-bottom">
      <div className="w-full max-w-[400px] text-center">
        <div className="mb-12">
          <div className="w-20 h-20 bg-gradient-to-b from-[#FF9500] to-[#FF6B00] rounded-[20px] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#FF9500]/30 animate-in fade-in zoom-in duration-700">
            <Sparkles className="text-white" size={40} />
          </div>
          <h1 className="title-large mb-2">HQ Intelligence</h1>
          <p className="headline text-[rgba(60,60,67,0.6)]">Restricted Access Terminal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="space-y-1.5 text-left">
            <label className="caption-2 ml-1">Email Address</label>
            <div className="relative group">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-[rgba(120,120,128,0.12)] border-none rounded-[12px] headline !font-normal focus:bg-white dark:focus:bg-[#1C1C1E] focus:ring-1 focus:ring-[#007AFF] transition-all" 
                required
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="caption-2 ml-1">Terminal Key</label>
            <div className="relative group">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 bg-[rgba(120,120,128,0.12)] border-none rounded-[12px] headline !font-normal focus:bg-white dark:focus:bg-[#1C1C1E] focus:ring-1 focus:ring-[#007AFF] transition-all" 
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[#FF3B30] headline text-[15px] pt-2 animate-in shake duration-300">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full primary-button tap-feedback flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={24} /> : 'Login'}
            </button>
          </div>
        </form>

        <p className="mt-12 caption-2 opacity-30">
          Lucky Orange &copy; 2025
        </p>
      </div>
    </div>
  );
};

export default Login;
