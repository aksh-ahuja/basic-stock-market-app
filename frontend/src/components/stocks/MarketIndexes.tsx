import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { IndexData } from '../../types/stock';
import { StockAPI } from '../../services/api';

export const MarketIndexes: React.FC = () => {
  const [indexes, setIndexes] = useState<IndexData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIndexes();
  }, []);

  const fetchIndexes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StockAPI.getIndexes();
      setIndexes(data);
    } catch (err) {
      setError('Failed to load market data');
      console.error('Error fetching indexes:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
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
        <Text style={styles.title}>Market Snapshot</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Market Snapshot</Text>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Market Snapshot</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {indexes.map((index, i) => (
          <View key={index.symbol} style={[styles.indexCard, i === 0 && styles.firstCard]}>
            <Text style={styles.indexName}>{index.name}</Text>
            <Text style={styles.indexPrice}>{formatPrice(index.price)}</Text>
            <View style={styles.changeContainer}>
              <Text style={[
                styles.changeText,
                { color: index.changePercent >= 0 ? '#34C759' : '#FF3B30' }
              ]}>
                {formatChange(index.change)}
              </Text>
              <Text style={[
                styles.changePercentText,
                { color: index.changePercent >= 0 ? '#34C759' : '#FF3B30' }
              ]}>
                {formatChangePercent(index.changePercent)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  indexCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  firstCard: {
    marginLeft: 0,
  },
  indexName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 8,
  },
  indexPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  changeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  changePercentText: {
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
  },
});