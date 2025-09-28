import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ExploreScreen } from './src/screens/{explore}/ExploreScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <ExploreScreen />
    </SafeAreaProvider>
  );
}