import { Request, Response, NextFunction } from 'express';
import { StockService } from '../services/stockService';
import { ApiResponse, PaginationParams } from '@/types/stock';

export class StockController {
  private stockService: StockService;

  constructor() {
    this.stockService = new StockService();
  }

  /**
   * Get market indexes
   */
  getIndexes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const indexes = await this.stockService.getIndexes();
      
      const response: ApiResponse<typeof indexes> = {
        success: true,
        data: indexes,
        timestamp: new Date().toISOString(),
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get top gainers
   */
  getTopGainers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: PaginationParams = {
        limit: parseInt(req.query.limit as string) || 20,
        page: parseInt(req.query.page as string) || 1,
      };

      const gainers = await this.stockService.getTopGainers(params);
      
      const response: ApiResponse<typeof gainers> = {
        success: true,
        data: gainers,
        timestamp: new Date().toISOString(),
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get top losers
   */
  getTopLosers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: PaginationParams = {
        limit: parseInt(req.query.limit as string) || 20,
        page: parseInt(req.query.page as string) || 1,
      };

      const losers = await this.stockService.getTopLosers(params);
      
      const response: ApiResponse<typeof losers> = {
        success: true,
        data: losers,
        timestamp: new Date().toISOString(),
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get most actively traded stocks
   */
  getMostActive = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: PaginationParams = {
        limit: parseInt(req.query.limit as string) || 20,
        page: parseInt(req.query.page as string) || 1,
      };

      const activeStocks = await this.stockService.getMostActive(params);
      
      const response: ApiResponse<typeof activeStocks> = {
        success: true,
        data: activeStocks,
        timestamp: new Date().toISOString(),
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get spotlight stock
   */
  getSpotlightStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const symbol = req.query.symbol as string || 'NVDA';
      const spotlight = await this.stockService.getSpotlightStock(symbol);
      
      const response: ApiResponse<typeof spotlight> = {
        success: true,
        data: spotlight,
        timestamp: new Date().toISOString(),
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get financial news
   */
  getFinancialNews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params: PaginationParams = {
        limit: parseInt(req.query.limit as string) || 10,
        page: parseInt(req.query.page as string) || 1,
      };

      const news = await this.stockService.getFinancialNews(params);
      
      const response: ApiResponse<typeof news> = {
        success: true,
        data: news,
        timestamp: new Date().toISOString(),
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Search stocks
   */
  searchStocks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query.q as string;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        res.status(400).json({
          success: false,
          error: 'Search query is required',
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const results = await this.stockService.searchStocks(query, limit);
      
      const response: ApiResponse<typeof results> = {
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      };
      
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}

export const stockController = new StockController();