import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Platform, SafeAreaView } from 'react-native';

const LoadingScreen = ({ message = 'Carregando...' }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ActivityIndicator 
          size="large" 
          color="#003366" 
          style={styles.indicator}
        />
        {message && (
          <Text style={styles.message}>{message}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fbf4dc',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fbf4dc',
    paddingHorizontal: Platform.OS === 'web' ? 0 : 20,
  },
  indicator: {
    marginBottom: Platform.OS === 'web' ? 20 : 16,
  },
  message: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#003366',
    fontWeight: '500',
    marginTop: Platform.OS === 'web' ? 10 : 8,
    textAlign: 'center',
  },
});

export default LoadingScreen;

