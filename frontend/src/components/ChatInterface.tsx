import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Zap, TrendingUp } from 'lucide-react';

interface ProductData {
  name: string;
  brand: string;
  price: number;
  confidence: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  productData: ProductData | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  productData
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[700px]">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-10 py-8 rounded-t-3xl border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-3xl">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">AI Shopping Assistant</h3>
              {productData && (
                <p className="text-sm opacity-90 flex items-center space-x-3 mt-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Analyzing: {productData.name} ({productData.brand})</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Online</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gray-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md lg:max-w-lg px-8 py-6 rounded-3xl ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-white to-gray-200 text-black shadow-xl'
                  : 'bg-gray-800 text-white border border-gray-700'
              }`}
            >
              <div className="flex items-start space-x-4">
                {message.type === 'assistant' && (
                  <div className="bg-white/20 p-3 rounded-2xl flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-base leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-70 mt-3 flex items-center space-x-2">
                    {message.type === 'user' && <User className="w-4 h-4" />}
                    <span>{formatTime(message.timestamp)}</span>
                  </p>
                </div>
                {message.type === 'user' && (
                  <div className="bg-black/20 p-3 rounded-2xl flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 max-w-md lg:max-w-lg px-8 py-6 rounded-3xl border border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-2xl">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-800 border-t border-gray-700 p-8 rounded-b-3xl">
        <form onSubmit={handleSubmit} className="flex space-x-6">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about pricing, trends, or recommendations..."
              className="w-full px-8 py-5 bg-gray-700 text-white placeholder-gray-400 rounded-2xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300 text-lg"
              disabled={isLoading}
            />
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="px-8 py-5 bg-gradient-to-r from-white to-gray-200 text-black rounded-2xl hover:from-gray-100 hover:to-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl flex items-center space-x-3 font-semibold text-lg"
          >
            <Send className="w-6 h-6" />
            <span>Send</span>
          </button>
        </form>
        
        <div className="mt-6 flex flex-wrap gap-3">
          {['What\'s the best time to buy?', 'Show me price history', 'Compare with similar items', 'Any discounts available?'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSendMessage(suggestion)}
              disabled={isLoading}
              className="px-6 py-3 bg-gray-700 text-white text-base rounded-xl hover:bg-gray-600 transition-all duration-300 border border-gray-600 disabled:opacity-50 font-medium"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface; 