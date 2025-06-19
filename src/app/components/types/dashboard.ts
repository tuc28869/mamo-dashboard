export interface AssetData {
  name: string;
  value: number;
  users: number;
}

export interface TVLData {
  totalTVL: number;
  usdcTotal: number;    // Add this property
  cbBTCTotal: number;   // Add this property
  assets: AssetData[];
  timestamp?: number;
}

export interface UserBreakdown {
  usdcOnly: number;
  cbBTCOnly: number;
  both: number;
  whales: number;
  retail: number;
}

export interface TokenHolderData {
  totalTokenHolders: number;
  platformUsers: number;
  overlap: number;
  conversionRate: number;
  avgTokensPerUser: number;
}

export interface UserSegment {
  address: string;
  usdcDeposits: number;
  cbBTCDeposits: number;
  totalWalletValue: number;
  depositFrequency: number;
  userTier: 'whale' | 'high-value' | 'mid-tier' | 'retail';
}

export interface SegmentData {
  segments: {
    whales: UserSegment[];
    highValue: UserSegment[];
    midTier: UserSegment[];
    retail: UserSegment[];
  };
  depositFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  totalDepositsPerSegment: {
    whales: number;
    retail: number;
  };
}

export interface BusinessMetrics {
  tvl: number;
  tvlChange: number;
  activeDepositors: number;
  userGrowth: number;
  whaleCount: number;
  whaleGrowth: number;
  conversionRate: number;
  conversionTrend: number;
}

export interface Holder {
  address: string;
  tokenBalance: number;
}
export interface User {
  address: string;
  lastActive: Date;
}
export interface AlertMessage {
  message: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
}
