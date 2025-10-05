"use client";

import { motion } from "framer-motion";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: string;
  actionExecuted?: string;
  actionResult?: any;
}

export function ChatMessage({ message, isUser, timestamp, actionExecuted, actionResult }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        {/* Avatar */}
        <div className={`flex items-center mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {!isUser && (
            <div className="w-8 h-8 bg-[#ffb34f] rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm font-bold">🦉</span>
            </div>
          )}
          <span className={`text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
            {isUser ? 'Ty' : 'ZUŚka'} • {new Date(timestamp).toLocaleTimeString('pl-PL', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          {isUser && (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-2">
              <span className="text-white text-sm font-bold">👤</span>
            </div>
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          
          {/* Action indicator */}
          {actionExecuted && (
            <div className="mt-2 pt-2 border-t border-gray-300 border-opacity-30">
              {actionExecuted === "calculate_pension" ? (
                <div className="flex items-center gap-2 text-xs text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>🔄 Przekierowuję do kalkulatora...</span>
                </div>
              ) : (
                <div className="text-xs opacity-75">
                  <span className="font-semibold">Akcja:</span> {actionExecuted}
                </div>
              )}
              {actionResult && actionExecuted !== "calculate_pension" && (
                <div className="text-xs opacity-60 mt-1">
                  {JSON.stringify(actionResult, null, 2)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
