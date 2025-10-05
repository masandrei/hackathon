/**
 * API Configuration
 * Centralized configuration for API calls
 */

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  ENABLE_MOCK_FALLBACK: process.env.NEXT_PUBLIC_ENV === 'development',
} as const;

export const API_ENDPOINTS = {
  CALCULATIONS: '/calculations',
  CALCULATIONS_EXPORT: '/calculations/export',
  STATISTICS: '/statistics',
  HEALTH: '/health',
  CHAT_OWL: '/chat/owl',
  CHAT_OWL_INFO: '/chat/owl/info',
  ANALYZE: '/calculations/analyze',
} as const;

/**
 * Helper to check if API is available
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

