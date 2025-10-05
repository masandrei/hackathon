"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChatService, ChatMessage, ChatResponse } from "@/api-client";
import { ChatHeader } from "./ChatHeader";
import { ChatMessage as ChatMessageComponent } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface Message {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
  actionExecuted?: string;
  actionResult?: any;
}

export function ChatContainer() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleActionExecution = (actionExecuted: string, actionResult: any) => {
    // Handle different actions from ZUŚka
    switch (actionExecuted) {
      case "calculate_pension":
        // Add a message about redirecting
        const redirectMessage: Message = {
          id: (Date.now() + 2).toString(),
          message: "🔄 Przekierowuję Cię do kalkulatora emerytur...",
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, redirectMessage]);
        
        // Redirect to calculator after showing the message
        setTimeout(() => {
          router.push("/symulacja");
        }, 3000); // Wait 3 seconds to show the message first
        break;
      case "show_statistics":
        // Could redirect to statistics page if it exists
        console.log("Statistics requested:", actionResult);
        break;
      case "health_check":
        // Show health status
        console.log("Health check:", actionResult);
        break;
      default:
        console.log("Unknown action:", actionExecuted, actionResult);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check API health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await ChatService.getOwlInfo();
        setIsOnline(true);
        setError(null);
      } catch (error) {
        setIsOnline(false);
        setError("Backend niedostępny");
      }
    };

    checkHealth();
  }, []);

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      message: messageText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response: ChatResponse = await ChatService.chatWithOwl({
        message: messageText,
      });

      // Add ZUŚka response
      const owlMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: response.response,
        isUser: false,
        timestamp: response.timestamp,
        actionExecuted: response.action_executed,
        actionResult: response.action_result,
      };

      setMessages(prev => [...prev, owlMessage]);
      setIsOnline(true);
      
      // Handle action execution if ZUŚka performed an action
      if (response.action_executed) {
        handleActionExecution(response.action_executed, response.action_result);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setError("Nie udało się wysłać wiadomości");
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        message: "Przepraszam, ale mam problem z połączeniem. Spróbuj ponownie za chwilę! 🦉",
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader isOnline={isOnline} />
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <div className="w-16 h-16 bg-[#ffb34f] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🦉</span>
            </div>
            <p className="text-lg font-medium mb-2">Cześć! Jestem ZUŚka! 🦉</p>
            <p className="text-sm">
              Mogę pomóc Ci z kalkulacjami emerytur, wyjaśnić pojęcia finansowe, 
              lub po prostu porozmawiać! Napisz do mnie!
            </p>
            <div className="mt-4 text-xs text-gray-400">
              <p>Przykłady pytań:</p>
              <p>• "Oblicz emeryturę"</p>
              <p>• "Pokaż statystyki"</p>
              <p>• "Co to jest waloryzacja?"</p>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessageComponent
            key={message.id}
            message={message.message}
            isUser={message.isUser}
            timestamp={message.timestamp}
            actionExecuted={message.actionExecuted}
            actionResult={message.actionResult}
          />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-t border-red-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-red-600">⚠️</span>
              <span className="text-sm text-red-800">{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        disabled={!isOnline}
      />

      {/* Clear Chat Button */}
      {messages.length > 0 && (
        <div className="p-2 bg-white border-t border-gray-200">
          <button
            onClick={clearChat}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Wyczyść historię rozmowy
          </button>
        </div>
      )}
    </div>
  );
}
