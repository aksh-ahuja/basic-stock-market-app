import { Router } from 'express';
import { stockController } from '../controllers/stockController';

const stockRoutes = Router();

/**
 * @route GET /api/indexes
 * @desc Get market indexes (S&P 500, NASDAQ, etc.)
 * @access Public
 */
stockRoutes.get('/indexes', stockController.getIndexes);

/**
 * @route GET /api/gainers
 * @desc Get top gainers
 * @access Public
 * @query limit - Number of results to return (default: 20)
 * @query page - Page number (default: 1)
 */
stockRoutes.get('/gainers', stockController.getTopGainers);

/**
 * @route GET /api/losers
 * @desc Get top losers
 * @access Public
 * @query limit - Number of results to return (default: 20)
 * @query page - Page number (default: 1)
 */
stockRoutes.get('/losers', stockController.getTopLosers);

/**
 * @route GET /api/active
 * @desc Get most actively traded stocks
 * @access Public
 * @query limit - Number of results to return (default: 20)
 * @query page - Page number (default: 1)
 */
stockRoutes.get('/active', stockController.getMostActive);

/**
 * @route GET /api/spotlight
 * @desc Get spotlight stock with detailed information
 * @access Public
 * @query symbol - Stock symbol (default: NVDA)
 */
stockRoutes.get('/spotlight', stockController.getSpotlightStock);

/**
 * @route GET /api/news
 * @desc Get financial news
 * @access Public
 * @query limit - Number of news items to return (default: 10)
 * @query page - Page number (default: 1)
 */
stockRoutes.get('/news', stockController.getFinancialNews);

/**
 * @route GET /api/search
 * @desc Search for stocks
 * @access Public
 * @query q - Search query (required)
 * @query limit - Number of results to return (default: 10)
 */
stockRoutes.get('/search', stockController.searchStocks);

export  {stockRoutes};