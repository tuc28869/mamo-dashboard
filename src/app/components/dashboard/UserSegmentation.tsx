import React, { useState, useEffect } from 'react';
import { SegmentData, UserSegment } from '../../../types/dashboard';
import mamoAnalyticsService from '../../services/mamoAnalytics';
import ChartSection from '../ui/ChartSection';
import DataTable from '../ui/DataTable';
import { formatCurrency } from '../../utils/analytics';

const UserSegmentation: React.FC = () => {
  const [segmentData, setSegmentData] = useState<SegmentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const segmentUsers = async () => {
      setIsLoading(true);
      try {
        const users = await mamoAnalyticsService.getUserDepositProfiles();
        
        const segments = {
          whales: users.filter(u => u.totalWalletValue > 100000),
          highValue: users.filter(u => u.totalWalletValue > 10000 && u.totalWalletValue <= 100000),
          midTier: users.filter(u => u.totalWalletValue > 1000 && u.totalWalletValue <= 10000),
          retail: users.filter(u => u.totalWalletValue <= 1000)
        };
        
        setSegmentData({
          segments,
          depositFrequency: {
            daily: users.filter(u => u.depositFrequency >= 30).length,
            weekly: users.filter(u => u.depositFrequency >= 4 && u.depositFrequency < 30).length,
            monthly: users.filter(u => u.depositFrequency >= 1 && u.depositFrequency < 4).length
          },
          totalDepositsPerSegment: {
            whales: segments.whales.reduce((sum, u) => sum + u.totalWalletValue, 0),
            retail: segments.retail.reduce((sum, u) => sum + u.totalWalletValue, 0)
          }
        });
      } catch (error) {
        console.error('Error segmenting users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    segmentUsers();
    const interval = setInterval(segmentUsers, 3600000); // Update hourly
    return () => clearInterval(interval);
  }, []);

  const segmentChartData = React.useMemo(() => {
    if (!segmentData) return [];
    
    return [
      { name: 'Whales (>$100K)', value: segmentData.segments.whales.length },
      { name: 'High Value ($10K-$100K)', value: segmentData.segments.highValue.length },
      { name: 'Mid Tier ($1K-$10K)', value: segmentData.segments.midTier.length },
      { name: 'Retail (<$1K)', value: segmentData.segments.retail.length }
    ];
  }, [segmentData]);

  const frequencyChartData = React.useMemo(() => {
    if (!segmentData) return [];
    
    return [
      { name: 'Daily Depositors', value: segmentData.depositFrequency.daily },
      { name: 'Weekly Depositors', value: segmentData.depositFrequency.weekly },
      { name: 'Monthly Depositors', value: segmentData.depositFrequency.monthly }
    ];
  }, [segmentData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-6">User Segmentation Analysis</h3>
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartSection
              title="Users by Wallet Size"
              chartType="pie"
              data={segmentChartData}
              dataKey="value"
              nameKey="name"
              colors={['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']}
            />
            
            <ChartSection
              title="Deposit Frequency"
              chartType="bar"
              data={frequencyChartData}
              dataKey="value"
              nameKey="name"
              colors={['#3B82F6']}
            />
          </div>
          
          <div className="mb-8">
            <h4 className="font-medium text-lg mb-4">Top User Segments by TVL</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium">Whale Segment Impact</h5>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Number of Whales:</span>
                    <strong>{segmentData?.segments.whales.length || 0}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <strong>{formatCurrency(segmentData?.totalDepositsPerSegment.whales || 0)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>% of Total TVL:</span>
                    <strong>
                      {segmentData && (segmentData.totalDepositsPerSegment.whales + segmentData.totalDepositsPerSegment.retail) > 0
                        ? ((segmentData.totalDepositsPerSegment.whales / (segmentData.totalDepositsPerSegment.whales + segmentData.totalDepositsPerSegment.retail)) * 100).toFixed(1)
                        : 0}%
                    </strong>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium">Retail Segment</h5>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span>Number of Retail Users:</span>
                    <strong>{segmentData?.segments.retail.length || 0}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <strong>{formatCurrency(segmentData?.totalDepositsPerSegment.retail || 0)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Per User:</span>
                    <strong>
                      {segmentData && segmentData.segments.retail.length > 0
                        ? formatCurrency(segmentData.totalDepositsPerSegment.retail / segmentData.segments.retail.length)
                        : '$0'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Whale User Details</h4>
            <DataTable
              data={segmentData?.segments.whales || []}
              columns={[
                { key: 'address', header: 'Wallet Address', render: (value) => `${value.substring(0, 6)}...${value.substring(value.length - 4)}` },
                { key: 'usdcDeposits', header: 'USDC', render: (value) => formatCurrency(value) },
                { key: 'cbBTCDeposits', header: 'cbBTC', render: (value) => `${value} BTC` },
                { key: 'totalWalletValue', header: 'Total Value', render: (value) => formatCurrency(value) },
                { key: 'depositFrequency', header: 'Frequency', render: (value) => `${value} deposits/month` }
              ]}
              pagination={true}
              itemsPerPage={5}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserSegmentation;