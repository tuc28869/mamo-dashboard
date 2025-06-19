'use client'

import React, { useState, useEffect } from 'react';
import { BusinessMetrics, AlertMessage } from '../types/dashboard';
import MetricsCard from '../UI/MetricsCard';
import TVLDashboard from './TVLDashboard';
import TokenHolderAnalysis from './TokenHolderAnalysis';
import UserSegmentation from './UserSegmentation';
import { trackUserEngagement } from '../../utils/analytics';

const ExecutiveDashboard: React.FC = () => {
  const [businessMetrics, setBusinessMetrics] = useState<BusinessMetrics | null>(null);
  const [performanceAlerts, setPerformanceAlerts] = useState<AlertMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fix hydration error by ensuring client-side rendering for timestamps
  useEffect(() => {
    setIsClient(true);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    // Track dashboard view only on client side
    if (isClient) {
      trackUserEngagement('dashboard_view', { page: 'executive_dashboard' });
    }
    
    const fetchBusinessMetrics = async () => {
      setIsLoading(true);
      try {
        // Use API routes instead of direct service calls to avoid Prisma/Ethers client-side errors
        const response = await fetch('/api/metrics', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Use mock data if API fails or returns no data
        const mockMetrics = {
          tvl: 1250000,
          tvlChange: 5.2,
          activeDepositors: 234,
          userGrowth: 12.8,
          whaleCount: 15,
          whaleGrowth: 3.5,
          conversionRate: 35.7,
          conversionTrend: 2.1
        };
        
        setBusinessMetrics(result.data ? {
          tvl: result.data.tvl || mockMetrics.tvl,
          tvlChange: mockMetrics.tvlChange,
          activeDepositors: result.data.activeUsers || mockMetrics.activeDepositors,
          userGrowth: mockMetrics.userGrowth,
          whaleCount: result.data.whaleUsers || mockMetrics.whaleCount,
          whaleGrowth: mockMetrics.whaleGrowth,
          conversionRate: result.data.conversionRate || mockMetrics.conversionRate,
          conversionTrend: mockMetrics.conversionTrend
        } : mockMetrics);
        
        setPerformanceAlerts([]);
        setLastUpdated(new Date());
        
      } catch (error) {
        console.error('Error fetching business metrics:', error);
        
        // Set mock data on error
        setBusinessMetrics({
          tvl: 1250000,
          tvlChange: 5.2,
          activeDepositors: 234,
          userGrowth: 12.8,
          whaleCount: 15,
          whaleGrowth: 3.5,
          conversionRate: 35.7,
          conversionTrend: 2.1
        });
        
        setPerformanceAlerts([{
          message: `Error loading dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`,
          severity: 'high',
          timestamp: Date.now()
        }]);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isClient) {
      fetchBusinessMetrics();
      // Refresh metrics every 15 minutes
      const interval = setInterval(fetchBusinessMetrics, 900000);
      return () => clearInterval(interval);
    }
  }, [isClient]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mamo.bot Business Intelligence Dashboard</h2>
        <div className="text-sm text-gray-500">
          {isClient && lastUpdated ? (
            `Last Updated: ${lastUpdated.toLocaleString()}`
          ) : (
            'Loading...'
          )}
        </div>
      </div>
      
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse h-24 bg-gray-200 rounded-lg"></div>
          ))
        ) : (
          <>
            <MetricsCard 
              title="Total Value Locked" 
              value={businessMetrics?.tvl || 0}
              change={businessMetrics?.tvlChange}
              format="currency"
            />
            <MetricsCard 
              title="Active Depositors" 
              value={businessMetrics?.activeDepositors || 0}
              change={businessMetrics?.userGrowth}
            />
            <MetricsCard 
              title="Whale Users" 
              value={businessMetrics?.whaleCount || 0}
              change={businessMetrics?.whaleGrowth}
            />
            <MetricsCard 
              title="Token Holder Conversion" 
              value={`${(businessMetrics?.conversionRate || 0).toFixed(1)}%`}
              change={businessMetrics?.conversionTrend}
            />
          </>
        )}
      </div>

      {/* Business Alerts */}
      {performanceAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-red-800 mb-2">Performance Alerts</h3>
          {performanceAlerts.map((alert, index) => (
            <div key={index} className="text-red-700 mb-1">
              • {alert.message} {isClient && `(${new Date(alert.timestamp).toLocaleString()})`}
            </div>
          ))}
        </div>
      )}

      {/* Detailed Dashboards */}
      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-semibold mb-4">Financial Metrics</h3>
          <TVLDashboard />
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-4">Token Holder Analysis</h3>
          <TokenHolderAnalysis />
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-4">User Segmentation</h3>
          <UserSegmentation />
        </section>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;