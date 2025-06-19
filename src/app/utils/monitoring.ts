export const monitorDataFreshness = (lastUpdate: string | Date): boolean => {
  const now = new Date();
  const updateTime = new Date(lastUpdate);
  const diffMinutes = (now.getTime() - updateTime.getTime()) / (1000 * 60);
  
  if (diffMinutes > 5) {
    // Alert if data is older than 5 minutes
    console.warn('Data may be stale');
    
    // In a real implementation, this would send to a monitoring service
    sendAlert({
      title: 'Stale Data Alert',
      message: `Dashboard data is ${Math.floor(diffMinutes)} minutes old`,
      level: 'warning'
    });
    
    return false;
  }
  
  return true;
};

export const trackPerformance = (metricName: string, startTime: number): number => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  // Log performance metrics
  console.log(`${metricName}: ${duration}ms`);
  
  // In a real implementation, this would send to a monitoring service
  if (duration > 1000) {
    sendAlert({
      title: 'Performance Alert',
      message: `${metricName} took ${duration.toFixed(0)}ms to complete`,
      level: 'warning'
    });
  }
  
  return duration;
};

interface Alert {
  title: string;
  message: string;
  level: 'info' | 'warning' | 'error';
  timestamp?: string;
}

export const sendAlert = (alert: Alert): void => {
  const alertWithTimestamp = {
    ...alert,
    timestamp: new Date().toISOString()
  };
  
  // In a real implementation, this would send to a monitoring service
  // like Sentry, DataDog, or a custom webhook
  console.warn(`ALERT: ${alertWithTimestamp.title} - ${alertWithTimestamp.message}`);
  
  // Example implementation for sending to a webhook
  if (typeof fetch !== 'undefined' && process.env.ALERT_WEBHOOK) {
    fetch(process.env.ALERT_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertWithTimestamp)
    }).catch(error => console.error('Error sending alert:', error));
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    // Check API endpoints
    const apiResponses = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`),
      // Add other health checks as needed
    ]);
    
    // Check if all responses are ok
    return apiResponses.every(response => response.ok);
  } catch (error) {
    console.error('Health check failed:', error);
    sendAlert({
      title: 'Health Check Failed',
      message: `Dashboard APIs are not responding: ${error}`,
      level: 'error'
    });
    return false;
  }
};