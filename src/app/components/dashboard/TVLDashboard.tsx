import React, { useState, useEffect } from 'react';
import { TVLData, UserBreakdown } from '../../../types/dashboard';
import mamoAnalyticsService from '../../services/mamoAnalytics';
import MetricsCard from '../ui/MetricsCard';
import ChartSection from '../ui/ChartSection';
import { monitorDataFreshness } from '../../utils/monitoring';
import { formatCurrency } from '../../utils/analytics';

const TVLDashboard: React.FC = () => {
  const [tvlData, setTVLData] = useState<TVLData | null>(null);
  const [userBreakdown, setUserBreakdown] = useState<UserBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  useEffect(() => {
    const fetchTVLData = async () => {
      setIsLoading(true);
      try {
        const deposits = await mamoAnalyticsService.getTotalDeposits();
        const users = await mamoAnalyticsService.getUserDepositProfiles();
        
        setTVLData({
          totalTVL: deposits.totalTVL,
          assets: [
            { name: 'USDC', value: deposits.usdcTotal, users: users.filter(u => u.usdcDeposits > 0).length },
            { name: 'cbBTC', value: deposits.cbBTCTotal, users: users.filter(u => u.cbBTCDeposits > 0).length }
          ]
        });
        
        setUserBreakdown({
          usdcOnly: users.filter(u => u.usdcDeposits > 0 && u.cbBTCDeposits === 0).length,
          cbBTCOnly: users.filter(u => u.cbBTCDeposits > 0 && u.usdcDeposits === 0).length,
          both: users.filter(u => u.usdcDeposits > 0 && u.cbBTCDeposits > 0).length,
          whales: users.filter(u => u.userTier === 'whale').length,
          retail: users.filter(u => u.userTier === 'retail').length
        });
        
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching TVL data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTVLData();
    const interval = setInterval(fetchTVLData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (lastUpdated) {
      monitorDataFreshness(lastUpdated);
    }
  }, [lastUpdated]);

  const userBreakdownChartData = React.useMemo(() => {
    if (!userBreakdown) return [];
    
    return [
      { name: 'USDC Only', value: userBreakdown.usdcOnly },
      { name: 'cbBTC Only', value: userBreakdown.cbBTCOnly },
      { name: 'Both Assets', value: userBreakdown.both }
    ];
  }, [userBreakdown]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Total Value Locked Overview</h3>
          {isLoading ? (
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          ) : (
            <>
              <div className="mb-6">
                <MetricsCard 
                  title="Total Value Locked (TVL)" 
                  value={tvlData?.totalTVL || 0} 
                  format="currency"
                  change={4.2} // Example change percentage
                />
              </div>
              <ChartSection
                title="TVL by Asset"
                chartType="bar"
                data={tvlData?.assets || []}
                dataKey="value"
                nameKey="name"
                height={250}
                yAxisLabel="USD Value"
              />
            </>
          )}
          <div className="text-xs text-gray-500 mt-4">
            Last updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Never'}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Deposit Patterns</h3>
          {isLoading ? (
            <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <MetricsCard 
                  title="Total Depositors" 
                  value={(userBreakdown?.usdcOnly || 0) + (userBreakdown?.cbBTCOnly || 0) + (userBreakdown?.both || 0)} 
                  change={12.5} // Example change percentage
                />
                <MetricsCard 
                  title="Whales" 
                  value={userBreakdown?.whales || 0}
                  change={2.8} // Example change percentage
                />
              </div>
              <ChartSection
                title="User Asset Distribution"
                chartType="pie"
                data={userBreakdownChartData}
                dataKey="value"
                nameKey="name"
                height={250}
                colors={['#3B82F6', '#F59E0B', '#10B981']}
              />
            </>
          )}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Asset Distribution</h3>
        {isLoading ? (
          <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tvlData?.assets.map((asset, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-lg mb-2">{asset.name}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <strong>{formatCurrency(asset.value)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Users:</span>
                    <strong>{asset.users}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg per User:</span>
                    <strong>{formatCurrency(asset.users > 0 ? asset.value / asset.users : 0)}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TVLDashboard;