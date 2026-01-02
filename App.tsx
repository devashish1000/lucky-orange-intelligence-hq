
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ExecutiveOverview from './pages/ExecutiveOverview';
import BehaviorFunnels from './pages/BehaviorFunnels';
import FeatureAdoption from './pages/FeatureAdoption';
import CustomerHealth from './pages/CustomerHealth';
import RevenueInsights from './pages/RevenueInsights';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<ExecutiveOverview />} />
          <Route path="/behavior" element={<BehaviorFunnels />} />
          <Route path="/adoption" element={<FeatureAdoption />} />
          <Route path="/health" element={<CustomerHealth />} />
          <Route path="/revenue" element={<RevenueInsights />} />
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
