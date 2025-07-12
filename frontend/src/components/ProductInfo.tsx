import React from 'react';
import { Tag, DollarSign, TrendingUp, Clock, CheckCircle, Sparkles, Zap, BarChart3, AlertCircle } from 'lucide-react';

interface ProductData {
  name: string;
  brand: string;
  price: number;
  confidence: number;
}

interface ProductInfoProps {
  product: ProductData;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const getRecommendationColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-white';
    if (confidence >= 0.6) return 'text-gray-300';
    return 'text-gray-400';
  };

  const getRecommendationIcon = (confidence: number) => {
    if (confidence >= 0.8) return <CheckCircle className="w-7 h-7 text-white" />;
    if (confidence >= 0.6) return <Clock className="w-7 h-7 text-gray-300" />;
    return <AlertCircle className="w-7 h-7 text-gray-400" />;
  };

  const getRecommendationText = (confidence: number) => {
    if (confidence >= 0.8) return "Excellent time to buy! This item is at a favorable price point.";
    if (confidence >= 0.6) return "Consider waiting. Prices may drop further in the coming weeks.";
    return "Prices are currently high. Wait for better deals.";
  };

  const getRecommendationBg = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-gradient-to-r from-white/20 to-gray-200/20 border-white/30';
    if (confidence >= 0.6) return 'bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-300/30';
    return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-white/10 to-gray-200/10 rounded-3xl p-8 border border-gray-700">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-3xl font-bold text-white mb-4">{product.name}</h3>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 px-4 py-2 rounded-2xl border border-gray-600">
                <div className="flex items-center space-x-3">
                  <Tag className="w-5 h-5 text-white" />
                  <span className="text-white font-semibold">{product.brand}</span>
                </div>
              </div>
              <div className="bg-gray-800 px-4 py-2 rounded-2xl border border-gray-600">
                <span className="text-gray-300 text-sm font-medium">
                  {(product.confidence * 100).toFixed(0)}% Match
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-white to-gray-200 p-4 rounded-3xl">
            <DollarSign className="w-8 h-8 text-black" />
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-4xl font-bold text-white">
            ${product.price.toFixed(2)}
          </div>
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-white" />
            <span className="text-white text-base font-semibold">Price tracked</span>
          </div>
        </div>
      </div>

      <div className={`${getRecommendationBg(product.confidence)} rounded-3xl p-8 border`}>
        <div className="flex items-start space-x-6">
          {getRecommendationIcon(product.confidence)}
          <div className="flex-1">
            <h4 className="font-bold text-white mb-3 flex items-center space-x-3">
              <Sparkles className="w-6 h-6" />
              <span className="text-xl">AI Recommendation</span>
            </h4>
            <p className="text-gray-200 leading-relaxed text-lg">
              {getRecommendationText(product.confidence)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-white to-gray-200 p-3 rounded-2xl">
            <BarChart3 className="w-6 h-6 text-black" />
          </div>
          <h4 className="font-bold text-white text-xl">Price Analysis</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-gray-300 text-base font-medium">Current Price</span>
            </div>
            <p className="text-white font-bold text-2xl">${product.price.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-700 rounded-2xl p-6 border border-gray-600">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-300 text-base font-medium">Avg. Price</span>
            </div>
            <p className="text-white font-bold text-2xl">${(product.price * 0.95).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-3xl p-8 border border-gray-700">
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-gradient-to-r from-white to-gray-200 p-3 rounded-2xl">
            <Zap className="w-6 h-6 text-black" />
          </div>
          <h4 className="font-bold text-white text-xl">Price History</h4>
        </div>
        
        <div className="h-40 bg-gray-700 rounded-2xl border border-gray-600 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="w-10 h-10 text-white mx-auto mb-3" />
            <p className="text-gray-400 text-base">Price history chart</p>
            <p className="text-gray-500 text-sm">Coming soon</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="font-bold text-white text-xl flex items-center space-x-3">
          <Sparkles className="w-6 h-6 text-white" />
          <span>Quick Actions</span>
        </h4>
        <div className="grid grid-cols-2 gap-6">
          <button className="bg-gradient-to-r from-white to-gray-200 text-black py-4 px-6 rounded-2xl hover:from-gray-100 hover:to-gray-300 transition-all duration-300 font-semibold text-lg shadow-xl">
            Set Price Alert
          </button>
          <button className="bg-gray-800 text-white py-4 px-6 rounded-2xl hover:bg-gray-700 transition-all duration-300 font-semibold text-lg border border-gray-600">
            View Similar Items
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-white/10 to-gray-200/10 rounded-3xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-white to-gray-200 p-3 rounded-2xl">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Detection Confidence</p>
              <p className="text-gray-300 text-base">AI accuracy score</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${getRecommendationColor(product.confidence)}`}>
              {(product.confidence * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo; 