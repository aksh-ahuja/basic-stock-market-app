import React from 'react';
import { ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { Header } from '../../components/common/Header';
import { MarketIndexes } from '../../components/stocks/MarketIndexes';
import { StockLists } from '../../components/stocks/StockLists';
import { StockSpotlight } from '../../components/stocks/StockSpotlight';
import { NewsSection } from '../../components/stocks/NewsSection';

export const ExploreScreen: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleProfilePress = () => {
    Alert.alert('Profile', 'Profile feature coming soon!');
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#007AFF"
          colors={['#007AFF']}
        />
      }
    >
      <Header title="Explore" onProfilePress={handleProfilePress} />
      
      <MarketIndexes />
      
      <StockLists />
      
      <StockSpotlight />
      
      <NewsSection />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});