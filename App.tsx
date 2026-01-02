
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ExecutiveOverview from './pages/ExecutiveOverview';
import BehaviorFunnels from './pages/BehaviorFunnels';
import FeatureAdoption from './pages/FeatureAdoption';
import CustomerHealth from './pages/CustomerHealth';
import RevenueInsights from './pages/RevenueInsights';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';

// Auth & Onboarding Context
interface AuthContextType {
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// Theme Context
interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

// UI Context for Haptics and Toasts
type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'error';

interface UIContextType {
  triggerHaptic: (pattern?: HapticPattern) => void;
  showToast: (msg: string) => void;
  toast: string | null;
}

const UIContext = createContext<UIContextType | null>(null);

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
};

const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }, []);

  const triggerHaptic = useCallback((pattern: HapticPattern = 'light') => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      switch(pattern) {
        case 'light': window.navigator.vibrate(10); break;
        case 'medium': window.navigator.vibrate(15); break;
        case 'heavy': window.navigator.vibrate(25); break;
        case 'success': window.navigator.vibrate([10, 5, 10]); break;
        case 'error': window.navigator.vibrate([20, 10, 20]); break;
        default: window.navigator.vibrate(10);
      }
    }
  }, []);

  return (
    <UIContext.Provider value={{ triggerHaptic, showToast, toast }}>
      {children}
    </UIContext.Provider>
  );
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('lo_dark_mode');
    if (saved !== null) return saved === 'true';
    // User requested default theme as light mode
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('lo_dark_mode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('lo_auth') === 'true');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => localStorage.getItem('lo_onboarded') === 'true');

  const login = (user: string, pass: string) => {
    if (user === 'growth@luckyorange.com' && pass === 'orange2025') {
      setIsAuthenticated(true);
      localStorage.setItem('lo_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('lo_auth');
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('lo_onboarded', 'true');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, hasCompletedOnboarding, login, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  if (!hasCompletedOnboarding) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ExecutiveOverview />} />
        <Route path="/behavior" element={<BehaviorFunnels />} />
        <Route path="/adoption" element={<FeatureAdoption />} />
        <Route path="/health" element={<CustomerHealth />} />
        <Route path="/revenue" element={<RevenueInsights />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <ThemeProvider>
          <UIProvider>
            <AppContent />
          </UIProvider>
        </ThemeProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
