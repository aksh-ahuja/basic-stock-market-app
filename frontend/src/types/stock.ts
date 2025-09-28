export interface StockQuote {
  symbol: string;
  shortName?: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  currency?: string;
  exchange?: string;
}

export interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
}

export interface GainerLoserStock {
  symbol: string;
  shortName: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  exchange: string;
  currency: string;
}

export interface SpotlightStock {
  symbol: string;
  shortName: string;
  longName: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  exchange: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  sector?: string;
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  summary?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}