import yahooFinance from 'yahoo-finance2';
import { 
  StockQuote, 
  IndexData, 
  GainerLoserStock, 
  SpotlightStock, 
  NewsItem,
  PaginationParams 
} from '@/types/stock';

// const yahooFinanceObj = new yahooFinance()


// export class StockService {
//   // Market indexes symbols
//   private readonly indexSymbols = {
//     'S&P 500': '^GSPC',
//     'NASDAQ': '^IXIC',
//     'Dow Jones': '^DJI',
//     'Russell 2000': '^RUT',
//   };

//   /**
//    * Get market indexes data
//    */
//  import yahooFinance from 'yahoo-finance2';
// import { 
//   StockQuote, 
//   IndexData, 
//   GainerLoserStock, 
//   SpotlightStock, 
//   NewsItem,
//   PaginationParams 
// } from '../types/stock';

export class StockService {
  private readonly indexSymbols = {
    'S&P 500': '^GSPC',
    'NASDAQ': '^IXIC',
    'Dow Jones': '^DJI',
    'Russell 2000': '^RUT',
  };

  /**
   * Get market indexes data
   */
  async getIndexes(): Promise<IndexData[]> {
    try {
      const symbols = Object.values(this.indexSymbols);
      const quotes = await yahooFinance.quote(symbols, {}, { validateResult: false }) as any;
      
      const indexes: IndexData[] = [];
      
      for (const [name, symbol] of Object.entries(this.indexSymbols)) {
        const quote = Array.isArray(quotes) ? 
          quotes.find((q: any) => q.symbol === symbol) : 
          (quotes.symbol === symbol ? quotes : null);
          
        if (quote) {
          indexes.push({
            symbol: quote.symbol || symbol,
            name,
            price: quote.regularMarketPrice || 0,
            change: quote.regularMarketChange || 0,
            changePercent: quote.regularMarketChangePercent || 0,
            currency: quote.currency || 'USD',
          });
        }
      }
      
      return indexes;
    } catch (error) {
      console.error('Error fetching indexes:', error);
      throw new Error('Failed to fetch market indexes');
    }
  }

  /**
   * Get top gainers
   */
  async getTopGainers(params: PaginationParams = {}): Promise<GainerLoserStock[]> {
    try {
      var { limit = 10, page = 1} = params;

      if(limit > 20) {
        limit = 20
      }

      if (page <= 0){
        page = 1
      }

      const start = (page - 1) * limit;
      
      const gainersResult = await yahooFinance.screener({scrIds: "day_gainers", count: limit, start: start} as any);
      
      if (!gainersResult || !gainersResult.quotes) {
        throw new Error('No gainers data available');
      }
      
      return gainersResult.quotes.slice(0, limit).map((stock: any) => ({
        symbol: stock.symbol,
        shortName: stock.shortName || stock.symbol,
        regularMarketPrice: stock.regularMarketPrice || 0,
        regularMarketChange: stock.regularMarketChange || 0,
        regularMarketChangePercent: stock.regularMarketChangePercent || 0,
        exchange: stock.fullExchangeName || stock.exchange || 'N/A',
        currency: stock.currency || 'USD',
      }));
    } catch (error) {
      console.error('Error fetching top gainers:', error);
      
      // Fallback: Get some popular stocks and filter for gainers
      const popularStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'];
      const quotes = await yahooFinance.quote(popularStocks, {}, { validateResult: false });
      const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
      
      // Filter for positive changes (gainers)
      const gainers = quotesArray
        .filter(stock => (stock.regularMarketChangePercent || 0) > 0)
        .sort((a, b) => (b.regularMarketChangePercent || 0) - (a.regularMarketChangePercent || 0));
      
      return gainers.slice(0, params.limit || 10).map((stock: any) => ({
        symbol: stock.symbol || '',
        shortName: stock.shortName || stock.symbol || '',
        regularMarketPrice: stock.regularMarketPrice || 0,
        regularMarketChange: stock.regularMarketChange || 0,
        regularMarketChangePercent: stock.regularMarketChangePercent || 0,
        exchange: stock.fullExchangeName || stock.exchange || 'N/A',
        currency: stock.currency || 'USD',
      }));
    }
  }

  /**
   * Get top losers
   */
  async getTopLosers(params: PaginationParams = {}): Promise<GainerLoserStock[]> {
    try {
      var { limit = 10,  page = 1 } = params;

      if(limit > 20) {
        limit = 20
      }

      if (page <= 0){
        page = 1
      }

      const start = (page - 1) * limit;
      
      const losersResult = await yahooFinance.screener({scrIds: "day_losers", count: limit, start: start} as any);
      
      if (!losersResult || !losersResult.quotes) {
        throw new Error('No losers data available');
      }
      
      return losersResult.quotes.slice(0, limit).map((stock: any) => ({
        symbol: stock.symbol,
        shortName: stock.shortName || stock.symbol,
        regularMarketPrice: stock.regularMarketPrice || 0,
        regularMarketChange: stock.regularMarketChange || 0,
        regularMarketChangePercent: stock.regularMarketChangePercent || 0,
        exchange: stock.fullExchangeName || stock.exchange || 'N/A',
        currency: stock.currency || 'USD',
      }));
    } catch (error) {
      console.error('Error fetching top losers:', error);
      
      // Fallback: Get some popular stocks and filter for losers
      const popularStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX', 'AMD', 'INTC'];
      const quotes = await yahooFinance.quote(popularStocks, {}, { validateResult: false });
      const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
      
      // Filter for negative changes (losers)
      const losers = quotesArray
        .filter(stock => (stock.regularMarketChangePercent || 0) < 0)
        .sort((a, b) => (a.regularMarketChangePercent || 0) - (b.regularMarketChangePercent || 0));
      
      return losers.slice(0, params.limit || 10).map(stock => ({
        symbol: stock.symbol || '',
        shortName: stock.shortName || stock.symbol || '',
        regularMarketPrice: stock.regularMarketPrice || 0,
        regularMarketChange: stock.regularMarketChange || 0,
        regularMarketChangePercent: stock.regularMarketChangePercent || 0,
        exchange: stock.fullExchangeName || stock.exchange || 'N/A',
        currency: stock.currency || 'USD',
      }));
    }
  }

  /**
   * Get most actively traded stocks
   */
async getMostActive(params: PaginationParams = {}): Promise<GainerLoserStock[]> {
    try {
      var { limit = 10,  page = 1 } = params;

      if(limit > 20) {
        limit = 20
      }

      if (page <= 0){
        page = 1
      }

      const start = (page - 1) * limit;
      
      // Try using screener for most active first
      try {
        const activeResult = await yahooFinance.screener({scrIds: "most_actives", count: limit, start: start} as any);

        
        if (activeResult && activeResult.quotes && activeResult.quotes.length > 0) {
          return activeResult.quotes.slice(0, limit).map((stock: any) => ({
            symbol: stock.symbol,
            shortName: stock.shortName || stock.displayName || stock.symbol,
            regularMarketPrice: stock.regularMarketPrice || 0,
            regularMarketChange: stock.regularMarketChange || 0,
            regularMarketChangePercent: stock.regularMarketChangePercent || 0,
            exchange: stock.fullExchangeName || stock.exchange || 'N/A',
            currency: stock.currency || 'USD',
          }));
        }
      } catch (screenerError) {
        console.log('Screener failed, trying trending symbols...', screenerError);
      }
      
      // Fallback to trending symbols
      const trending = await yahooFinance.trendingSymbols('US', {}, { validateResult: false }) as any;
      
      if (trending && trending.quotes && trending.quotes.length > 0) {
        const trendingSymbols = trending.quotes.slice(0, limit).map((quote: any) => quote.symbol);
        
        const quotes = await yahooFinance.quote(trendingSymbols, {}, { validateResult: false }) as any;
        const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
        
        return quotesArray.map((stock: any) => ({
          symbol: stock.symbol || '',
          shortName: stock.shortName || stock.symbol || '',
          regularMarketPrice: stock.regularMarketPrice || 0,
          regularMarketChange: stock.regularMarketChange || 0,
          regularMarketChangePercent: stock.regularMarketChangePercent || 0,
          exchange: stock.fullExchangeName || stock.exchange || 'N/A',
          currency: stock.currency || 'USD',
        }));
      }
      
      const popularStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];
      const quotes = await yahooFinance.quote(popularStocks, {}, { validateResult: false }) as any;
      const quotesArray = Array.isArray(quotes) ? quotes : [quotes];
      
      return quotesArray.slice(0, limit).map((stock: any) => ({
        symbol: stock.symbol || '',
        shortName: stock.shortName || stock.symbol || '',
        regularMarketPrice: stock.regularMarketPrice || 0,
        regularMarketChange: stock.regularMarketChange || 0,
        regularMarketChangePercent: stock.regularMarketChangePercent || 0,
        exchange: stock.fullExchangeName || stock.exchange || 'N/A',
        currency: stock.currency || 'USD',
      }));
      
    } catch (error) {
      console.error('Error fetching most active stocks:', error);
      throw new Error('Failed to fetch most active stocks');
    }
  }


  /**
   * Get spotlight stock (featured stock with detailed info)
   */
  async getSpotlightStock(symbol: string = 'NVDA'): Promise<SpotlightStock> {
    try {
      const [quote, summary] = await Promise.all([
        yahooFinance.quote(symbol),
        yahooFinance.quoteSummary(symbol, { 
          modules: ['assetProfile', 'price', 'summaryDetail'] 
        })
      ]);

      const quoteData = Array.isArray(quote) ? quote[0] : quote;
      const profile = summary.assetProfile;
      const price = summary.price;

      return {
        symbol: quoteData.symbol || symbol,
        shortName: quoteData.shortName || symbol,
        longName: quoteData.longName || quoteData.shortName || symbol,
        price: quoteData.regularMarketPrice || 0,
        change: quoteData.regularMarketChange || 0,
        changePercent: quoteData.regularMarketChangePercent || 0,
        currency: quoteData.currency || 'USD',
        exchange: quoteData.fullExchangeName || quoteData.exchange || 'N/A',
        description: profile?.longBusinessSummary,
        website: profile?.website,
        industry: profile?.industry,
        sector: profile?.sector,
        logo: `https://logo.clearbit.com/${profile?.website?.replace(/^https?:\/\//, '').split('/')[0]}`,
      };
    } catch (error) {
      console.error('Error fetching spotlight stock:', error);
      throw new Error('Failed to fetch spotlight stock');
    }
  }

  /**
   * Get financial news
   */
async getFinancialNews(params: PaginationParams = {}): Promise<NewsItem[]> {
    try {
      const { limit = 10 } = params;
      
      const searchResults = await yahooFinance.search('financial news', {
        newsCount: limit,
      } as any, { validateResult: false }) as any;

      if (searchResults && searchResults.news && searchResults.news.length > 0) {
        return searchResults.news.map((article: any) => ({
          title: article.title,
          link: article.link,
          pubDate: article.providerPublishTime,
          source: article.publisher,
          summary: article.summary,
        }));
      }

      // Fallback: get news for popular stocks
      const popularStock = 'AAPL';
      const stockNews = await yahooFinance.search(popularStock, {
        newsCount: limit,
      }, { validateResult: false }) as any;

      return stockNews && stockNews.news ? stockNews.news.map((article: any) => ({
        title: article.title,
        link: article.link,
        pubDate: new Date(article.providerPublishTime * 1000).toISOString(),
        source: article.publisher,
        summary: article.summary,
      })) : [];
      
    } catch (error) {
      console.error('Error fetching financial news:', error);
      throw new Error('Failed to fetch financial news');
    }
  }

  /**
   * Search stocks
   */
  async searchStocks(query: string, limit: number = 10): Promise<StockQuote[]> {
    try {
      const searchResults = await yahooFinance.search(query, {
        quotesCount: limit,
      }, { validateResult: false }) as any;

      if (searchResults && searchResults.quotes && searchResults.quotes.length > 0) {
        return searchResults.quotes.map((quote: any) => ({
          symbol: quote.symbol,
          shortName: quote.shortname || quote.longname,
          longName: quote.longname,
          exchange: quote.exchDisp,
          currency: quote.currency,
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching stocks:', error);
      throw new Error('Failed to search stocks');
    }
  }
}
