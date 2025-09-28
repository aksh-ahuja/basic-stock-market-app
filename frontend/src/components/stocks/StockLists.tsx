import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { GainerLoserStock } from '../../types/stock';
import { StockAPI } from '../../services/api';

type TabType = 'gainers' | 'losers' | 'active';

interface StockItemProps {
  stock: GainerLoserStock;
}

const StockItem: React.FC<StockItemProps> = ({ stock }) => {
  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const formatChange = (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  const formatChangePercent = (changePercent: number): string => {
    const sign = changePercent >= 0 ? '+' : '';
    return `${sign}${changePercent.toFixed(2)}%`;
  };

  const isPositive = stock.regularMarketChangePercent >= 0;

  return (
    <View style={styles.stockItem}>
      <View style={styles.stockInfo}>
        <Text style={styles.stockSymbol}>{stock.symbol}</Text>
        <Text style={styles.stockName} numberOfLines={1}>{stock.shortName}</Text>
        <Text style={styles.stockExchange}>{stock.exchange}</Text>
      </View>
      <View style={styles.stockPrices}>
        <Text style={styles.stockPrice}>{formatPrice(stock.regularMarketPrice)}</Text>
        <Text style={[
          styles.stockChange,
          { color: isPositive ? '#34C759' : '#FF3B30' }
        ]}>
          {formatChange(stock.regularMarketChange)}
        </Text>
        <Text style={[
          styles.stockChangePercent,
          { 
            color: isPositive ? '#34C759' : '#FF3B30',
            backgroundColor: isPositive ? '#E8F5E8' : '#FFEBEE'
          }
        ]}>
          {formatChangePercent(stock.regularMarketChangePercent)}
        </Text>
      </View>
    </View>
  );
};

export const StockLists: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('gainers');
  const [stocks, setStocks] = useState<GainerLoserStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchStocks(activeTab, 1, true);
  }, [activeTab]);

  const fetchStocks = async (tab: TabType, pageNum: number = 1, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setStocks([]);
        setPage(1);
        setHasMore(true);
      }

      let data: GainerLoserStock[] = [];
      
      switch (tab) {
        case 'gainers':
          data = await StockAPI.getTopGainers(pageNum, 20);
          break;
        case 'losers':
          data = await StockAPI.getTopLosers(pageNum, 20);
          break;
        case 'active':
          data = await StockAPI.getMostActive(pageNum, 20);
          break;
      }

      if (reset) {
        setStocks(data);
      } else {
        setStocks(prev => [...prev, ...data]);
      }

      setHasMore(data.length >= 20);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      Alert.alert('Error', 'Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (tab: TabType) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && stocks.length > 0) {
      fetchStocks(activeTab, page + 1, false);
    }
  };

  const renderLoadMoreButton = () => {
    if (!hasMore || stocks.length === 0) return null;

    return (
      <TouchableOpacity 
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#007AFF" />
        ) : (
          <Text style={styles.loadMoreText}>View More</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Lists</Text>
      
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'gainers' && styles.activeTab]}
          onPress={() => handleTabPress('gainers')}
        >
          <Text style={[styles.tabText, activeTab === 'gainers' && styles.activeTabText]}>
            Top Gainers
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'losers' && styles.activeTab]}
          onPress={() => handleTabPress('losers')}
        >
          <Text style={[styles.tabText, activeTab === 'losers' && styles.activeTabText]}>
            Top Losers
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => handleTabPress('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Actively Trading
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stock List */}
      {loading && stocks.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : stocks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No data available</Text>
        </View>
      ) : (
        <>
          {/* Render all stock items */}
          {stocks.map((item) => (
            <StockItem key={`${item.symbol}-${activeTab}`} stock={item} />
          ))}
          
          {/* Load More Button */}
          {renderLoadMoreButton()}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  stockItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  stockName: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  stockExchange: {
    fontSize: 12,
    color: '#C7C7CC',
  },
  stockPrices: {
    alignItems: 'flex-end',
  },
  stockPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  stockChange: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  stockChangePercent: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  loadMoreButton: {
    margin: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
});