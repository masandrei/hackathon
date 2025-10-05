"use client";

import { useState, useEffect } from "react";
import { ChatService, OwlInfoResponse } from "@/api-client";

interface ChatHeaderProps {
  isOnline: boolean;
}

export function ChatHeader({ isOnline }: ChatHeaderProps) {
  const [owlInfo, setOwlInfo] = useState<OwlInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOwlInfo = async () => {
      try {
        const info = await ChatService.getOwlInfo();
        setOwlInfo(info);
      } catch (error) {
        console.error("Failed to fetch owl info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwlInfo();
  }, []);

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center gap-3">
        {/* Owl Avatar */}
        <div className="relative">
          <div className="w-12 h-12 bg-[#ffb34f] rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🦉</span>
          </div>
          {/* Online indicator */}
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`} />
        </div>

        {/* Owl Info */}
        <div className="flex-1">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          ) : owlInfo ? (
            <>
              <h2 className="text-lg font-semibold text-gray-800">{owlInfo.name}</h2>
              <p className="text-sm text-gray-600">{owlInfo.description}</p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-gray-800">ZUŚka</h2>
              <p className="text-sm text-gray-600">Inteligentna maskotka aplikacji do kalkulacji emerytur</p>
            </>
          )}
        </div>

        {/* Status */}
        <div className="text-right">
          <div className={`text-xs px-2 py-1 rounded-full ${
            isOnline 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>
    </div>
  );
}
