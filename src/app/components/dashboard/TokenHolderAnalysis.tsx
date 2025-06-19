import React, { useState, useEffect } from 'react';
import { TokenHolderData } from '../../../types/dashboard';
import mamoAnalyticsService from '../../services/mamoAnalytics';
import MetricsCard from '../ui/MetricsCard';
import ChartSection from '../ui/ChartSection';
import DataTable from '../ui/DataTable';

const TokenHolderAnalysis: React.FC = () => {
  const [holderData, setHolderData] = useState<TokenHolderData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const analyzeTokenHolders = async () => {
      setIsLoading(true);
      try {
        // Query MAMO token holders and platform users
        const tokenHolders = await mamoAnalyticsService.getMAMOTokenHolders();
        const platformUsers = await mamoAnalyticsService.getPlatformUsers();
        
        // Find intersection of token holders and platform users
        const overlap = tokenHolders.filter(holder => 
          platformUsers.some(user => user.address === holder.address)
        );
        
        setHolderData({
          totalTokenHolders: tokenHolders.length,
          platformUsers: platformUsers.length,
          overlap: overlap.length,
          conversionRate: (overlap.length / tokenHolders.length) * 100,
          avgTokensPerUser: overlap.reduce((sum, user) => sum + user.tokenBalance, 0) / overlap.length
        });
      } catch (error) {
        console.error('Error analyzing token holders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    analyzeTokenHolders();
    const interval = setInterval(analyzeTokenHolders, 3600000); // Update hourly
    return () => clearInterval(interval);
  }, []);

  const conversionChartData = React.useMemo(() => {
    if (!holderData) return [];
    
    return [
      { name: 'Platform Users (Non-Holders)', value: holderData.platformUsers - holderData.overlap },
      { name: 'Token Holders (Non-Users)', value: holderData.totalTokenHolders - holderData.overlap },
      { name: 'Both Holders & Users', value: holderData.overlap }
    ];
  }, [holderData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-6">MAMO Token Holder Platform Adoption</h3>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricsCard 
              title="Total Token Holders" 
              value={holderData?.totalTokenHolders || 0}
              change={8.2} // Example change percentage
            />
            <MetricsCard 
              title="Platform Users" 
              value={holderData?.platformUsers || 0}
              change={15.4} // Example change percentage
            />
            <MetricsCard 
              title="Conversion Rate" 
              value={`${(holderData?.conversionRate || 0).toFixed(1)}%`}
              change={3.7} // Example change percentage
            />
            <MetricsCard 
              title="Avg Tokens/User" 
              value={Math.round(holderData?.avgTokensPerUser || 0).toLocaleString()}
              change={-1.2} // Example change percentage
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSection
              title="User vs Token Holder Distribution"
              chartType="pie"
              data={conversionChartData}
              dataKey="value"
              nameKey="name"
              colors={['#10B981', '#F59E0B', '#3B82F6']}
            />
            
            <div>
              <h4 className="font-medium text-lg mb-4">Token Holder Insights</h4>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Token Holder Retention</h5>
                  <p className="text-gray-600">
                    {holderData?.conversionRate || 0}% of token holders are actively using the platform, 
                    representing a significant opportunity to engage the remaining 
                    {holderData ? (100 - holderData.conversionRate).toFixed(1) : 0}%.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">User Acquisition</h5>
                  <p className="text-gray-600">
                    {holderData ? ((holderData.overlap / holderData.platformUsers) * 100).toFixed(1) : 0}% 
                    of platform users are also token holders, suggesting strong 
                    product-token alignment.
                  </p>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h5 className="font-medium mb-2">Growth Opportunities</h5>
                  <p className="text-gray-600">
                    Target the {holderData ? (holderData.totalTokenHolders - holderData.overlap).toLocaleString() : 0} 
                    token holders not yet using the platform to drive significant user growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TokenHolderAnalysis;