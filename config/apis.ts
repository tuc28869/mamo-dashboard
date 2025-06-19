export const API_CONFIG = {
  coingecko: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    endpoints: {
      mamoToken: '/coins/mamo',
      marketData: '/coins/mamo/market_chart',
    },
    headers: {
      'x-cg-pro-api-key': process.env.COINGECKO_API_KEY || '',
    }
  },
  bitquery: {
    baseUrl: 'https://graphql.bitquery.io',
    headers: {
      'X-API-KEY': process.env.BITQUERY_API_KEY || '',
    }
  },
  baseRpc: {
    url: process.env.BASE_RPC_URL || 'https://base-mainnet.g.alchemy.com/v2/demo',
  },
  mamoContract: {
    address: '0x7300B37DfdfAb110d83290A29DfB31B1740219fE', // Example address
    tokenContract: '0x8c5bAC7c9778e18B7CA79b024dB3639b08d18e96', // Example MAMO token address
  }
};

export const ABI = [
  // This would contain the actual ABI for the Mamo contract
  // This is a simplified example
  {
    "inputs": [],
    "name": "getTotalDeposits",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getUSDCDeposits",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCBBTCDeposits",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];