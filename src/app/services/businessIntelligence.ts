import prisma, { getLastMetrics, saveMetrics } from '../../lib/database';
import mamoAnalyticsService from './mamoAnalytics';
import { Holder, User, AlertMessage } from '../components/types/dashboard';

export class BusinessIntelligenceEngine {
  private metricsCache: Map<number, any>;
  private alertThresholds: {
    tvlDropPercent: number;
    dailyDepositDecrease: number;
    whaleChurnRate: number;
  };
  
  private currentTVL: number = 0;
  private activeUsers: number = 0;
  private whaleUsers: number = 0;
  private conversionRate: number = 0;

  constructor() {
    this.metricsCache = new Map();
    this.alertThresholds = {
      tvlDropPercent: -10,
      dailyDepositDecrease: -20,
      whaleChurnRate: 5
    };
  }

  async calculateTVL(): Promise<number> {
    const deposits = await mamoAnalyticsService.getTotalDeposits();
    this.currentTVL = deposits.totalTVL;
    return this.currentTVL;
  }

  async getDepositActivity() {
    const users = await mamoAnalyticsService.getUserDepositProfiles();
    this.activeUsers = users.length;
    this.whaleUsers = users.filter(u => u.userTier === 'whale').length;
    
    return {
      activeUsers: this.activeUsers,
      whaleUsers: this.whaleUsers,
      depositFrequency: {
        daily: users.filter(u => u.depositFrequency >= 30).length,
        weekly: users.filter(u => u.depositFrequency >= 4 && u.depositFrequency < 30).length,
        monthly: users.filter(u => u.depositFrequency >= 1 && u.depositFrequency < 4).length
      }
    };
  }

  async analyzeUserSegmentation() {
    const users = await mamoAnalyticsService.getUserDepositProfiles();
    
    return {
      segments: {
        whales: users.filter(u => u.userTier === 'whale'),
        highValue: users.filter(u => u.userTier === 'high-value'),
        midTier: users.filter(u => u.userTier === 'mid-tier'),
        retail: users.filter(u => u.userTier === 'retail')
      }
    };
  }

  async calculateTokenHolderConversion(): Promise<number> {
    const tokenHolders = await mamoAnalyticsService.getMAMOTokenHolders();
    const platformUsers = await mamoAnalyticsService.getPlatformUsers();
    
    // Find overlap between token holders and platform users
    const overlap = tokenHolders.filter((holder: Holder) =>
      platformUsers.some((user: User) => user.address === holder.address)
    );
    
    this.conversionRate = (overlap.length / tokenHolders.length) * 100;
    return this.conversionRate;
  }

  async processRealTimeMetrics() {
    const currentMetrics = {
      tvl: await this.calculateTVL(),
      depositActivity: await this.getDepositActivity(),
      userSegmentation: await this.analyzeUserSegmentation(),
      tokenHolderConversion: await this.calculateTokenHolderConversion()
    };

    // Cache for trend analysis
    this.metricsCache.set(Date.now(), currentMetrics);
    
    // Use API route for database operations instead of direct Prisma calls
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMetrics)
      });
    } catch (error) {
      console.warn('Failed to save metrics to database:', error);
      // Continue without failing the entire operation
    }
    
    // Check for anomalies or business alerts
    const alerts = await this.checkBusinessAlerts(currentMetrics);
    
    return {
      metrics: currentMetrics,
      alerts
    };
  }

  async getPreviousDayMetrics() {
    try {
      const response = await fetch('/api/metrics', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching previous metrics:', error);
      return null;
    }
  }

  async checkBusinessAlerts(metrics: any): Promise<AlertMessage[]> {
    const alerts: AlertMessage[] = [];
    const previousMetrics = await this.getPreviousDayMetrics();
    
    if (previousMetrics) {
      const tvlChange = ((metrics.tvl - previousMetrics.tvl) / previousMetrics.tvl) * 100;
      
      if (tvlChange < this.alertThresholds.tvlDropPercent) {
        alerts.push({
          message: `TVL dropped by ${tvlChange.toFixed(2)}%`,
          severity: 'high',
          timestamp: Date.now()
        });
      }
    }
    
    return alerts;
  }

  generateBusinessReport() {
    return {
      keyMetrics: {
        totalTVL: this.currentTVL,
        activeDepositors: this.activeUsers,
        whaleCount: this.whaleUsers,
        tokenHolderConversionRate: this.conversionRate
      },
      trends: this.calculateTrends(),
      recommendations: this.generateRecommendations()
    };
  }
  
  calculateTrends() {
    // Calculate trends based on cached metrics
    // This would be implemented with actual time-series analysis
    return {
      tvlGrowth: '+5.2%',
      userGrowth: '+12.8%',
      depositFrequencyChange: '+3.4%'
    };
  }
  
  generateRecommendations() {
    // This would implement business logic to generate recommendations
    // based on the metrics and trends
    return [
      "Increase incentives for cbBTC deposits to balance asset distribution",
      "Target MAMO token holders who haven't used the platform yet",
      "Implement retention program for whale users"
    ];
  }
}

export default new BusinessIntelligenceEngine();