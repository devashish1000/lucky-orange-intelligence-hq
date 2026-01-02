
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface KPIStats {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  suffix?: string;
  id?: string;
}

export interface KPIDetail extends KPIStats {
  history: { date: string; value: number }[];
  breakdown: { label: string; value: number; percent: number }[];
}

export interface AccountHealth {
  id: string;
  name: string;
  plan: string;
  mrr: number;
  healthScore: number;
  riskLevel: RiskLevel;
  drivers: string[];
  lastActive: string;
  industry: string;
}

export interface FeatureUsage {
  feature: string;
  adoption: number;
  engagement: number;
  correlationToRetention: number;
}

export interface FunnelStep {
  name: string;
  visitors: number;
  dropOff: number;
  conversionRate: number;
  linkToTool?: 'Recordings' | 'Heatmaps' | 'Forms';
}

export interface RevenueMetric {
  plan: string;
  mrr: number;
  accounts: number;
  churnRate: number;
}

export interface InsightCardData {
  title: string;
  description: string;
  category: 'Opportunity' | 'Alert' | 'Trend';
  priority: 'High' | 'Medium' | 'Low';
  targetPath?: string;
  targetFilter?: any;
}
