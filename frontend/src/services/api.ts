import axios from 'axios';
import { ApiResponse, IndexData, GainerLoserStock, SpotlightStock, NewsItem } from '../types/stock';
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class StockAPI {
  static async getIndexes(): Promise<IndexData[]> {
    try {
      const response = await api.get<ApiResponse<IndexData[]>>('/indexes');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching indexes:', error);
      throw new Error('Failed to fetch market indexes');
    }
  }

  static async getTopGainers(page: number = 1, limit: number = 20): Promise<GainerLoserStock[]> {
    try {
      const response = await api.get<ApiResponse<GainerLoserStock[]>>('/gainers', {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching gainers:', error);
      throw new Error('Failed to fetch top gainers');
    }
  }

  static async getTopLosers(page: number = 1, limit: number = 20): Promise<GainerLoserStock[]> {
    try {
      const response = await api.get<ApiResponse<GainerLoserStock[]>>('/losers', {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching losers:', error);
      throw new Error('Failed to fetch top losers');
    }
  }

  static async getMostActive(page: number = 1, limit: number = 20): Promise<GainerLoserStock[]> {
    try {
      const response = await api.get<ApiResponse<GainerLoserStock[]>>('/active', {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching active stocks:', error);
      throw new Error('Failed to fetch most active stocks');
    }
  }

  static async getSpotlightStock(symbol?: string): Promise<SpotlightStock> {
    try {
      const response = await api.get<ApiResponse<SpotlightStock>>('/spotlight', {
        params: symbol ? { symbol } : {}
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching spotlight stock:', error);
      throw new Error('Failed to fetch spotlight stock');
    }
  }

  static async getFinancialNews(page: number = 1, limit: number = 10): Promise<NewsItem[]> {
    try {
      const response = await api.get<ApiResponse<NewsItem[]>>('/news', {
        params: { page, limit }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch financial news');
    }
  }
}