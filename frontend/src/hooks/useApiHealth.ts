"use client";

import { useState, useEffect, useCallback } from 'react';
import { StatisticsService } from '@/api-client';

export interface ApiHealthStatus {
  isHealthy: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  error: string | null;
}

/**
 * Hook to check and monitor API health
 * @param intervalMs - How often to check (0 = check once, no polling)
 */
export function useApiHealth(intervalMs: number = 0) {
  const [status, setStatus] = useState<ApiHealthStatus>({
    isHealthy: false,
    isChecking: true,
    lastChecked: null,
    error: null,
  });

  const checkHealth = useCallback(async () => {
    try {
      setStatus(prev => ({ ...prev, isChecking: true, error: null }));
      
      const response = await StatisticsService.healthCheck();
      
      setStatus({
        isHealthy: response.status === 'healthy',
        isChecking: false,
        lastChecked: new Date(),
        error: null,
      });
    } catch (error) {
      setStatus({
        isHealthy: false,
        isChecking: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkHealth();

    // Setup polling if interval > 0
    if (intervalMs > 0) {
      const intervalId = setInterval(checkHealth, intervalMs);
      return () => clearInterval(intervalId);
    }
  }, [checkHealth, intervalMs]);

  return {
    ...status,
    refetch: checkHealth,
  };
}

