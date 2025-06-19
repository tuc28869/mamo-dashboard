// src/app/actions/metrics.ts
'use server'

import prisma, { getLastMetrics, saveMetrics } from '../../lib/database';

export async function saveMetrics(data: any) {
  try {
    return await prisma.metrics.create({
      data: {
        ...data,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Database save error:', error);
    throw error;
  }
}

export async function getLastMetrics() {
  try {
    return await prisma.metrics.findFirst({
      orderBy: {
        timestamp: 'desc',
      },
    });
  } catch (error) {
    console.error('Database fetch error:', error);
    return null;
  }
}