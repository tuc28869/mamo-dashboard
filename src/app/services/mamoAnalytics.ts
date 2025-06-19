import { TVLData, UserSegment } from '../components/types/dashboard';

export class MamoAnalyticsService {
  constructor() {
    // Remove Ethers.js client-side initialization to prevent browser errors
  }

  async getTotalDeposits(): Promise<TVLData> {
    try {
      // Use API route for blockchain data instead of direct Ethers calls
      const response = await fetch('/api/blockchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getTotalDeposits'
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return {
            totalTVL: parseFloat(result.data.totalTVL) || 0,
            usdcTotal: parseFloat(result.data.usdcTotal) || 0,
            cbBTCTotal: parseFloat(result.data.cbBTCTotal) || 0,
            assets: result.data.assets || [],
            timestamp: Date.now()
          };
        }
      }
      
      throw new Error('API request failed');
    } catch (error) {
      console.error('Error fetching total deposits:', error);
      
      // Return realistic mock data for development
      return {
        totalTVL: 1250000,
        usdcTotal: 750000,
        cbBTCTotal: 500000,
        assets: [
          { name: 'USDC', value: 750000, users: 234 },
          { name: 'cbBTC', value: 500000, users: 156 },
        ],
        timestamp: Date.now()
      };
    }
  }

  async getAssetDeposits(assetType: 'USDC' | 'cbBTC'): Promise<number> {
    try {
      const response = await fetch('/api/blockchain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getAssetDeposits',
          assetType
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        return result.success ? parseFloat(result.data) : 0;
      }
      
      return 0;
    } catch (error) {
      console.error(`Error fetching ${assetType} deposits:`, error);
      return 0;
    }
  }

  async getUserDepositProfiles(): Promise<UserSegment[]> {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          return result.data;
        }
      }
      
      throw new Error('API request failed');
    } catch (error) {
      console.error('Error fetching user deposit profiles:', error);
      
      // Return enhanced mock data for development
      return [
        {
          address: '0x1234567890abcdef1234567890abcdef12345678',
          usdcDeposits: 10000,
          cbBTCDeposits: 0.5,
          totalWalletValue: 40000,
          depositFrequency: 35,
          userTier: 'mid-tier'
        },
        {
          address: '0xabcdef1234567890abcdef1234567890abcdef12',
          usdcDeposits: 250000,
          cbBTCDeposits: 2.1,
          totalWalletValue: 376000,
          depositFrequency: 12,
          userTier: 'whale'
        },
        {
          address: '0x9876543210fedcba9876543210fedcba98765432',
          usdcDeposits: 5000,
          cbBTCDeposits: 0,
          totalWalletValue: 5000,
          depositFrequency: 8,
          userTier: 'mid-tier'
        },
        {
          address: '0xfedcba0987654321fedcba0987654321fedcba09',
          usdcDeposits: 150000,
          cbBTCDeposits: 1.8,
          totalWalletValue: 258000,
          depositFrequency: 20,
          userTier: 'whale'
        },
        {
          address: '0x1111222233334444555566667777888899990000',
          usdcDeposits: 800,
          cbBTCDeposits: 0,
          totalWalletValue: 800,
          depositFrequency: 2,
          userTier: 'retail'
        }
      ];
    }
  }

  classifyUserTier(depositAmount: number): 'whale' | 'high-value' | 'mid-tier' | 'retail' {
    if (depositAmount > 100000) return 'whale';
    if (depositAmount > 10000) return 'high-value';
    if (depositAmount > 1000) return 'mid-tier';
    return 'retail';
  }
  
  async getMAMOTokenHolders() {
    try {
      const response = await fetch('/api/token-holders', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return result.data;
        }
      }
      
      throw new Error('API request failed');
    } catch (error) {
      console.error('Error fetching MAMO token holders:', error);
      
      // Return mock data
      return Array.from({ length: 5000 }, (_, i) => ({
        address: `0x${i.toString(16).padStart(40, '0')}`,
        tokenBalance: Math.floor(Math.random() * 100000),
      }));
    }
  }
  
  async getPlatformUsers() {
    try {
      const response = await fetch('/api/platform-users', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          return result.data;
        }
      }
      
      throw new Error('API request failed');
    } catch (error) {
      console.error('Error fetching platform users:', error);
      
      // Return mock data
      return Array.from({ length: 2000 }, (_, i) => ({
        address: `0x${i.toString(16).padStart(40, '0')}`,
        lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      }));
    }
  }
}

export default new MamoAnalyticsService();