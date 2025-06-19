// src/app/api/blockchain/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { JsonRpcProvider, Contract, formatUnits } from 'ethers';

const provider = new JsonRpcProvider(process.env.BASE_RPC_URL);

export async function POST(request: NextRequest) {
  try {
    const { action, contractAddress, abi } = await request.json();
    
    switch (action) {
      case 'getTotalDeposits':
        const contract = new Contract(contractAddress, abi, provider);
        const deposits = await contract.getTotalDeposits();
        return NextResponse.json({ 
          success: true, 
          data: formatUnits(deposits, 18) 
        });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Blockchain API error:', error);
    return NextResponse.json({ error: 'Failed to fetch blockchain data' }, { status: 500 });
  }
}