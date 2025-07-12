import React, { useState } from 'react';
import CameraCapture from './components/CameraCapture';
import ChatInterface from './components/ChatInterface';
import ProductInfo from './components/ProductInfo';
import { Camera, MessageCircle, ShoppingBag, Sparkles, Zap } from 'lucide-react';
import apiService from './services/api';

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

function App() {
  const [activeTab, setActiveTab] = useState<'camera' | 'chat'>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hey there! 👋 I\'m your AI shopping assistant. Take a photo of any item you\'re interested in, and I\'ll help you make the smartest buying decision with real-time price analysis and personalized recommendations.',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setIsLoading(true);
    
    try {
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
      
      const detectionResult = await apiService.detectProduct(file);
      
      setProductData({
        name: detectionResult.name,
        brand: detectionResult.brand,
        price: detectionResult.price,
        confidence: detectionResult.confidence
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error processing image:', error);
      setIsLoading(false);
    }
  };

  const handleChatMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const chatResponse = await apiService.sendChatMessage(message, productData);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: chatResponse.response,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-white to-gray-300 p-4 rounded-3xl mr-6">
              <Sparkles className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-6xl font-bold text-white">
              SnapScout
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            AI-powered shopping intelligence.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-gray-900 rounded-2xl p-1.5 border border-gray-800 flex">
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex items-center px-8 py-3 rounded-xl transition-all duration-300 font-semibold text-base ${
                activeTab === 'camera'
                  ? 'bg-gradient-to-r from-white to-gray-200 text-black shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Camera className="w-5 h-5 mr-2" />
              <span>Smart Capture</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center px-8 py-3 rounded-xl transition-all duration-300 font-semibold text-base ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-white to-gray-200 text-black shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              <span>AI Assistant</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {activeTab === 'camera' ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
              <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8">
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-r from-white to-gray-200 p-3 rounded-2xl mr-4">
                    <Camera className="w-7 h-7 text-black" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    Smart Product Detection
                  </h2>
                </div>
                <CameraCapture 
                  onImageCapture={handleImageCapture}
                  isLoading={isLoading}
                />
              </div>

              <div className="bg-gray-900 rounded-3xl border border-gray-800 p-8">
                <div className="flex items-center mb-8">
                  <div className="bg-gradient-to-r from-white to-gray-200 p-3 rounded-2xl mr-4">
                    <Zap className="w-7 h-7 text-black" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">
                    AI Analysis
                  </h2>
                </div>
                {productData ? (
                  <ProductInfo product={productData} />
                ) : (
                  <div className="text-center py-20">
                    <div className="bg-gray-800 p-12 rounded-3xl border border-gray-700">
                      <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-500" />
                      <h3 className="text-2xl font-bold text-white mb-4">
                        Ready to Analyze
                      </h3>
                      <p className="text-gray-400 text-lg leading-relaxed">
                        Take a photo or upload an image to get instant AI-powered insights
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-3xl border border-gray-800">
              <ChatInterface 
                messages={chatMessages}
                onSendMessage={handleChatMessage}
                isLoading={isLoading}
                productData={productData}
              />
            </div>
          )}
        </div>

        <div className="text-center mt-16 text-gray-500">
          <p className="text-sm">
            Powered by advanced AI • Real-time price analysis • Smart recommendations
          </p>
        </div>
      </div>
    </div>
  );
}

export default App; 