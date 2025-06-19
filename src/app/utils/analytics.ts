export const trackUserEngagement = (action: string, properties: Record<string, any> = {}) => {
  // Track user interactions with the dashboard
  const eventData = {
    action,
    timestamp: new Date().toISOString(),
    properties: {
      ...properties,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server',
      url: typeof window !== 'undefined' ? window.location.href : '/'
    }
  };
  
  // Send to analytics service
  if (typeof fetch !== 'undefined') {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData)
    }).catch(error => console.error('Analytics error:', error));
  }
};

export const calculateEngagementRate = (activeUsers: number, totalUsers: number): number => {
  return totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};

export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

export const segmentUsers = (users: any[], property: string, breakpoints: number[]): any => {
  const segments: any = {};
  
  breakpoints.forEach((breakpoint, index) => {
    const nextBreakpoint = breakpoints[index + 1] || Infinity;
    const segmentName = `${breakpoint}-${nextBreakpoint === Infinity ? 'above' : nextBreakpoint}`;
    
    segments[segmentName] = users.filter(user => 
      user[property] >= breakpoint && user[property] < nextBreakpoint
    );
  });
  
  return segments;
};