"use client";

import { useApiHealth } from '@/hooks/useApiHealth';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ApiStatusIndicatorProps {
  showLabel?: boolean;
  pollInterval?: number; // in ms, 0 = no polling
}

export function ApiStatusIndicator({ 
  showLabel = false, 
  pollInterval = 0 
}: ApiStatusIndicatorProps) {
  const { isHealthy, isChecking, lastChecked, error, refetch } = useApiHealth(pollInterval);

  const getStatusColor = () => {
    if (isChecking) return 'bg-yellow-400';
    if (isHealthy) return 'bg-green-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (isChecking) return 'Sprawdzanie...';
    if (isHealthy) return 'API działa prawidłowo';
    return 'API niedostępne';
  };

  const getStatusDetails = () => {
    const details = [getStatusText()];
    if (lastChecked) {
      details.push(`Ostatnie sprawdzenie: ${lastChecked.toLocaleTimeString('pl-PL')}`);
    }
    if (error) {
      details.push(`Błąd: ${error}`);
    }
    return details.join('\n');
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${getStatusColor()} ${isHealthy ? 'animate-pulse' : ''}`} />
            {showLabel && <span>{getStatusText()}</span>}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-xs whitespace-pre-line max-w-xs">
            {getStatusDetails()}
            <div className="mt-2 text-gray-400">Kliknij aby odświeżyć</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

