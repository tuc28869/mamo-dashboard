// src/app/api/metrics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma, { getLastMetrics, saveMetrics } from '../../../lib/database';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const savedMetrics = await prisma.metrics.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    });
    
    return NextResponse.json({ success: true, data: savedMetrics });
  } catch (error) {
    console.error('Metrics API error:', error);
    return NextResponse.json({ error: 'Failed to save metrics' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const lastMetrics = await prisma.metrics.findFirst({
      orderBy: {
        timestamp: 'desc',
      },
    });
    
    return NextResponse.json({ success: true, data: lastMetrics });
  } catch (error) {
    console.error('Metrics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}