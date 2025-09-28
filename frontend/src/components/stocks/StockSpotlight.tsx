import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ActivityIndicator,
  TouchableOpacity 
} from 'react-native';
import { SpotlightStock } from '../../types/stock';
import { StockAPI } from '../../services/api';

export const StockSpotlight: React.FC = () => {
  const [stock, setStock] = useState<SpotlightStock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSpotlightStock();
  }, []);

  const fetchSpotlightStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StockAPI.getSpotlightStock();
      setStock(data);
    } catch (err) {
      setError('Failed to load spotlight stock');
      console.error('Error fetching spotlight stock:', err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Stock Spotlight</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (error || !stock) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Stock Spotlight</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'No spotlight stock available'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchSpotlightStock}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isPositive = stock.changePercent >= 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stock Spotlight</Text>
      
      <View style={styles.spotlightCard}>
        {/* Header with logo and symbol */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {stock.logo ? (
              <Image 
                source={{ uri: stock.logo }} 
                style={styles.logo}
                defaultSource={require('../../../assets/icon.png')}
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>{stock.symbol.charAt(0)}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.stockInfo}>
            <Text style={styles.stockSymbol}>{stock.symbol}</Text>
            <Text style={styles.stockName} numberOfLines={1}>{stock.shortName}</Text>
            <Text style={styles.stockExchange}>{stock.exchange}</Text>
          </View>
        </View>

        {/* Price Information */}
        <View style={styles.priceSection}>
          <Text style={styles.price}>{formatPrice(stock.price)}</Text>
          <View style={styles.changeContainer}>
            <Text style={[
              styles.change,
              { color: isPositive ? '#34C759' : '#FF3B30' }
            ]}>
              {formatChange(stock.change)}
            </Text>
            <Text style={[
              styles.changePercent,
              { 
                color: isPositive ? '#34C759' : '#FF3B30',
                backgroundColor: isPositive ? '#E8F5E8' : '#FFEBEE'
              }
            ]}>
              {formatChangePercent(stock.changePercent)}
            </Text>
          </View>
        </View>

        {/* Company Description */}
        {stock.description && (
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionTitle}>About</Text>
            <Text style={styles.description} numberOfLines={4}>
              {stock.description}
            </Text>
          </View>
        )}

        {/* Additional Info */}
        {(stock.industry || stock.sector) && (
          <View style={styles.additionalInfo}>
            {stock.sector && (
              <View style={styles.infoTag}>
                <Text style={styles.infoTagText}>{stock.sector}</Text>
              </View>
            )}
            {stock.industry && (
              <View style={styles.infoTag}>
                <Text style={styles.infoTagText}>{stock.industry}</Text>
              </View>
            )}
          </View>
        )}
      </View>
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
  spotlightCard: {
    marginHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoContainer: {
    marginRight: 16,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  stockInfo: {
    flex: 1,
  },
  stockSymbol: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  stockName: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 2,
  },
  stockExchange: {
    fontSize: 14,
    color: '#C7C7CC',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  changeContainer: {
    alignItems: 'flex-end',
  },
  change: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  changePercent: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  descriptionSection: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#8E8E93',
  },
  additionalInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  infoTagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
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
});