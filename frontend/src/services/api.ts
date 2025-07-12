import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ProductDetectionResponse {
  name: string;
  brand: string;
  price: number;
  confidence: number;
  category: string;
}

export interface ChatResponse {
  response: string;
  sources: Array<{
    id: string;
    price_history: any;
  }>;
}

export interface RecommendationResponse {
  answer: string;
  sources: Array<{
    id: string;
    price_history: any;
  }>;
}

export const apiService = {
  detectProduct: async (imageFile: File): Promise<ProductDetectionResponse> => {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await api.post('/detect-product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  sendChatMessage: async (message: string, productData?: any): Promise<ChatResponse> => {
    const response = await api.post('/chat', {
      message,
      product_data: productData,
    });
    return response.data;
  },

  getRecommendations: async (question: string): Promise<RecommendationResponse> => {
    const response = await api.post('/recommend', {
      question,
    });
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default apiService; 