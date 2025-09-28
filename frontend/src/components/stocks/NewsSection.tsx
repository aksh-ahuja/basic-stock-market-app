import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Linking,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NewsItem } from '../../types/stock';
import { StockAPI } from '../../services/api';

interface NewsItemComponentProps {
  item: NewsItem;
  onPress: (url: string) => void;
}

const NewsItemComponent: React.FC<NewsItemComponentProps> = ({ item, onPress }) => {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) {
        return 'Just now';
      } else if (diffInHours < 24) {
        return `${diffInHours}h ago`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d ago`;
      }
    } catch (error) {
      return 'Recently';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.newsItem}
      onPress={() => onPress(item.link)}
      activeOpacity={0.7}
    >
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={3}>
          {item.title}
        </Text>
        
        <View style={styles.newsMetadata}>
          <Text style={styles.newsSource}>{item.source}</Text>
          <Text style={styles.newsDot}>•</Text>
          <Text style={styles.newsTime}>{formatDate(item.pubDate)}</Text>
        </View>
        
        {item.summary && (
          <Text style={styles.newsSummary} numberOfLines={2}>
            {item.summary}
          </Text>
        )}
      </View>
      
      <View style={styles.newsArrow}>
        <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );
};

export const NewsSection: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNews(1, true);
  }, []);

  const fetchNews = async (pageNum: number = 1, reset: boolean = false) => {
    try {
      if (reset) {
        setLoading(true);
        setNews([]);
        setPage(1);
      } else {
        setLoadingMore(true);
      }

      const data = await StockAPI.getFinancialNews(pageNum, 5);
      
      if (reset) {
        setNews(data);
      } else {
        setNews(prev => [...prev, ...data]);
      }

      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching news:', error);
      Alert.alert('Error', 'Failed to load news');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleNewsPress = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore) {
      fetchNews(page + 1, false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Latest News</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Latest News</Text>
        <TouchableOpacity onPress={() => fetchNews(1, true)}>
          <Ionicons name="refresh" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {news.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="newspaper-outline" size={48} color="#C7C7CC" />
          <Text style={styles.emptyText}>No news available</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchNews(1, true)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Render news items directly without FlatList */}
          {news.map((item, index) => (
            <NewsItemComponent 
              key={`${item.link}-${index}`} 
              item={item} 
              onPress={handleNewsPress} 
            />
          ))}
          
          {/* Load More Button */}
          <TouchableOpacity 
            style={styles.loadMoreButton}
            onPress={handleLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <ActivityIndicator size="small" color="#007AFF" />
            ) : (
              <Text style={styles.loadMoreText}>View More</Text>
            )}
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  newsItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  newsContent: {
    flex: 1,
    marginRight: 12,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    lineHeight: 22,
    marginBottom: 8,
  },
  newsMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsSource: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
  },
  newsDot: {
    fontSize: 12,
    color: '#C7C7CC',
    marginHorizontal: 6,
  },
  newsTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  newsSummary: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  newsArrow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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