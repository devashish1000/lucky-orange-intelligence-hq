
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Puzzle, 
  HeartPulse, 
  DollarSign, 
  Search, 
  PlayCircle, 
  Map as MapIcon, 
  BarChart3, 
  FormInput, 
  MessageSquare, 
  Sparkles 
} from 'lucide-react';
import { KPIStats, AccountHealth, FeatureUsage, FunnelStep, RevenueMetric, InsightCardData, KPIDetail } from './types';

export const NAVIGATION = [
  { name: 'Executive Overview', icon: <LayoutDashboard size={20} />, path: '/' },
  { name: 'Behavior & Funnels', icon: <Users size={20} />, path: '/behavior' },
  { name: 'Feature Adoption', icon: <Puzzle size={20} />, path: '/adoption' },
  { name: 'Customer Health', icon: <HeartPulse size={20} />, path: '/health' },
  { name: 'Revenue Insights', icon: <DollarSign size={20} />, path: '/revenue' },
];

export const MOCK_KPIS: KPIStats[] = [
  { id: 'sites', label: 'Total Tracked Sites', value: '42,109', change: 12.5, trend: 'up' },
  { id: 'visitors', label: 'Monthly Active Visitors', value: '1.2B', change: 4.2, trend: 'up' },
  { id: 'mrr', label: 'Current MRR', value: '$842,500', change: 8.1, trend: 'up', suffix: 'USD' },
  { id: 'nrr', label: 'Net Revenue Retention', value: '108%', change: -1.2, trend: 'down' },
];

export const MOCK_KPI_DETAILS: Record<string, KPIDetail> = {
  sites: {
    id: 'sites', label: 'Total Tracked Sites', value: '42,109', change: 12.5, trend: 'up',
    history: [
      { date: '90d ago', value: 35000 }, { date: '60d ago', value: 38200 }, { date: '30d ago', value: 40100 }, { date: 'Now', value: 42109 }
    ],
    breakdown: [
      { label: 'Enterprise', value: 15000, percent: 35 },
      { label: 'Pro', value: 18109, percent: 43 },
      { label: 'Basic', value: 9000, percent: 22 }
    ]
  },
  visitors: {
    id: 'visitors', label: 'Monthly Active Visitors', value: '1.2B', change: 4.2, trend: 'up',
    history: [
      { date: '90d ago', value: 1100000000 }, { date: '60d ago', value: 1150000000 }, { date: 'Now', value: 1200000000 }
    ],
    breakdown: [
      { label: 'Direct', value: 600000000, percent: 50 },
      { label: 'Organic Search', value: 400000000, percent: 33 },
      { label: 'Referral', value: 200000000, percent: 17 }
    ]
  },
  mrr: {
    id: 'mrr', label: 'Current MRR', value: '$842,500', change: 8.1, trend: 'up', suffix: 'USD',
    history: [
      { date: 'Jan', value: 720000 }, { date: 'Feb', value: 745000 }, { date: 'Mar', value: 760000 }, { date: 'Apr', value: 785000 }, { date: 'May', value: 810000 }, { date: 'Jun', value: 842500 }
    ],
    breakdown: [
      { label: 'Enterprise', value: 450000, percent: 53 },
      { label: 'Pro', value: 280000, percent: 33 },
      { label: 'Starter', value: 112500, percent: 14 }
    ]
  },
  nrr: {
    id: 'nrr', label: 'Net Revenue Retention', value: '108%', change: -1.2, trend: 'down',
    history: [
      { date: 'Q3 2024', value: 112 }, { date: 'Q4 2024', value: 110 }, { date: 'Q1 2025', value: 108 }
    ],
    breakdown: [
      { label: 'Expansion', value: 15, percent: 15 },
      { label: 'Contraction', value: -4, percent: 4 },
      { label: 'Churn', value: -3, percent: 3 }
    ]
  }
};

export const MOCK_INSIGHTS: InsightCardData[] = [
  { 
    title: 'Heatmap Usage Surge', 
    description: 'Heatmap usage is up 18% among Enterprise accounts in the Retail sector.', 
    category: 'Trend', 
    priority: 'Medium',
    targetPath: '/adoption',
    targetFilter: { feature: 'Dynamic Heatmaps' }
  },
  { 
    title: 'Discovery AI Upsell Opportunity', 
    description: '142 Pro accounts have reached their manual analysis limit but haven\'t enabled Discovery AI.', 
    category: 'Opportunity', 
    priority: 'High',
    targetPath: '/health',
    targetFilter: { plan: 'Pro', driver: 'Manual Limit' }
  },
  { 
    title: 'Retention Risk Alert', 
    description: 'Accounts with <2 session recordings per week show a 4x higher churn risk.', 
    category: 'Alert', 
    priority: 'High',
    targetPath: '/health',
    targetFilter: { risk: 'High', health: 'Low' }
  },
];

export const MOCK_FEATURE_USAGE: FeatureUsage[] = [
  { feature: 'Session Recordings', adoption: 92, engagement: 85, correlationToRetention: 0.88 },
  { feature: 'Dynamic Heatmaps', adoption: 78, engagement: 62, correlationToRetention: 0.75 },
  { feature: 'Conversion Funnels', adoption: 45, engagement: 40, correlationToRetention: 0.92 },
  { feature: 'Form Analytics', adoption: 38, engagement: 22, correlationToRetention: 0.68 },
  { feature: 'Surveys', adoption: 25, engagement: 18, correlationToRetention: 0.55 },
  { feature: 'Discovery AI', adoption: 15, engagement: 55, correlationToRetention: 0.95 },
];

export const MOCK_FUNNEL: FunnelStep[] = [
  { name: 'Landing Page', visitors: 100000, dropOff: 0, conversionRate: 100 },
  { name: 'Product View', visitors: 45000, dropOff: 55, conversionRate: 45, linkToTool: 'Heatmaps' },
  { name: 'Add to Cart', visitors: 12000, dropOff: 73.3, conversionRate: 12, linkToTool: 'Recordings' },
  { name: 'Checkout Start', visitors: 8000, dropOff: 33.3, conversionRate: 8, linkToTool: 'Forms' },
  { name: 'Purchase Complete', visitors: 3200, dropOff: 60, conversionRate: 3.2 },
];

export const MOCK_HEALTH_ACCOUNTS: AccountHealth[] = [
  { id: '1', name: 'Zylker Corp', plan: 'Enterprise', mrr: 2400, healthScore: 92, riskLevel: 'Low', drivers: ['High AI Usage', 'Frequent API calls'], lastActive: '2 mins ago', industry: 'E-commerce' },
  { id: '2', name: 'Acme Retail', plan: 'Pro', mrr: 450, healthScore: 42, riskLevel: 'High', drivers: ['Low Recording Usage', 'Expired Credit Card', 'Manual Limit'], lastActive: '4 days ago', industry: 'Retail' },
  { id: '3', name: 'Global Tech', plan: 'Enterprise', mrr: 1800, healthScore: 75, riskLevel: 'Medium', drivers: ['Support Ticket Volume'], lastActive: '1 hour ago', industry: 'SaaS' },
  { id: '4', name: 'Local Shop', plan: 'Basic', mrr: 49, healthScore: 88, riskLevel: 'Low', drivers: ['Consistent Usage'], lastActive: '10 mins ago', industry: 'SMB' },
  { id: '5', name: 'Mega Store', plan: 'Pro', mrr: 450, healthScore: 35, riskLevel: 'High', drivers: ['Uninstalled Tracking Script', 'Manual Limit'], lastActive: '2 weeks ago', industry: 'E-commerce' },
];

export const MOCK_REVENUE: RevenueMetric[] = [
  { plan: 'Enterprise', mrr: 450000, accounts: 120, churnRate: 1.2 },
  { plan: 'Pro', mrr: 280000, accounts: 850, churnRate: 2.8 },
  { plan: 'Starter', mrr: 95000, accounts: 2100, churnRate: 4.5 },
  { plan: 'Free', mrr: 0, accounts: 15000, churnRate: 12.4 },
];
