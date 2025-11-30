import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';

const LinkedAccountsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [linkedAccounts, setLinkedAccounts] = useState([
    { id: '1', name: 'Google', email: 'usuario@gmail.com', status: 'active', icon: 'logo-google' },
    { id: '2', name: 'Facebook', email: 'usuario@facebook.com', status: 'active', icon: 'logo-facebook' },
  ]);

  useEffect(() => {
    const loadAccounts = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await new Promise(resolve => setTimeout(resolve, 700));
      setIsLoading(false);
    };
    loadAccounts();
  }, []);

  const handleUnlink = (accountId) => {
    Alert.alert(
      'Desvincular Conta',
      'Tem certeza que deseja desvincular esta conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desvincular',
          style: 'destructive',
          onPress: () => {
            setLinkedAccounts(linkedAccounts.filter(acc => acc.id !== accountId));
            Alert.alert('Sucesso', 'Conta desvinculada com sucesso!');
          },
        },
      ]
    );
  };

  const handleAddAccount = () => {
    Alert.alert('Adicionar Conta', 'Funcionalidade em desenvolvimento');
  };

  if (isLoading) {
    return <LoadingScreen message="Carregando contas..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {Platform.OS === 'web' ? (
              <Text style={styles.backText}>←</Text>
            ) : (
              <Ionicons name="arrow-back" size={24} color="#000" />
            )}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Contas Vinculadas</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Gerencie as contas de terceiros conectadas ao seu perfil. Você pode vincular ou desvincular contas a qualquer momento.
          </Text>
        </View>

        <View style={styles.accountsContainer}>
          {linkedAccounts.map((account) => (
            <View key={account.id} style={styles.accountCard}>
              <View style={styles.accountHeader}>
                <View style={styles.accountIconContainer}>
                  <Ionicons name={account.icon} size={32} color="#003366" />
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountEmail}>{account.email}</Text>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, account.status === 'active' && styles.statusDotActive]} />
                    <Text style={styles.statusText}>
                      {account.status === 'active' ? 'Ativa' : 'Inativa'}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.unlinkButton}
                onPress={() => handleUnlink(account.id)}
              >
                <Ionicons name="close-circle-outline" size={24} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddAccount}>
          <Ionicons name="add-circle-outline" size={24} color="#003366" />
          <Text style={styles.addButtonText}>Vincular Nova Conta</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf4dc',
  },
  header: {
    paddingTop: Platform.OS === 'web' ? 15 : Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: Platform.OS === 'web' ? 15 : 14,
    paddingHorizontal: Platform.OS === 'web' ? 15 : 16,
    backgroundColor: '#a1d5ff',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingTop: Platform.OS === 'web' ? 0 : Platform.OS === 'ios' ? 12 : 50,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    padding: Platform.OS === 'web' ? 0 : 8,
    paddingTop: Platform.OS === 'web' ? 0 : Platform.OS === 'ios' ? 12 : 60,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: Platform.OS === 'web' ? 24 : 22,
    color: '#000',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '700',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Platform.OS === 'web' ? 20 : 16,
    paddingBottom: Platform.OS === 'web' ? 20 : 24,
  },
  infoCard: {
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 18 : 16,
    borderRadius: Platform.OS === 'web' ? 10 : 16,
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    borderLeftWidth: 5,
    borderLeftColor: '#003366',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#555',
    lineHeight: Platform.OS === 'web' ? 20 : 19,
  },
  accountsContainer: {
    marginBottom: Platform.OS === 'web' ? 20 : 16,
  },
  accountCard: {
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 18 : 16,
    borderRadius: Platform.OS === 'web' ? 10 : 16,
    marginBottom: Platform.OS === 'web' ? 16 : 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIconContainer: {
    width: Platform.OS === 'web' ? 56 : 52,
    height: Platform.OS === 'web' ? 56 : 52,
    borderRadius: Platform.OS === 'web' ? 28 : 26,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Platform.OS === 'web' ? 15 : 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: Platform.OS === 'web' ? 17 : 16,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 4 : 2,
  },
  accountEmail: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#666',
    marginBottom: Platform.OS === 'web' ? 6 : 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginRight: 6,
  },
  statusDotActive: {
    backgroundColor: '#2ECC71',
  },
  statusText: {
    fontSize: Platform.OS === 'web' ? 12 : 11,
    color: '#666',
  },
  unlinkButton: {
    padding: Platform.OS === 'web' ? 8 : 6,
  },
  addButton: {
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 18 : 16,
    borderRadius: Platform.OS === 'web' ? 10 : 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#003366',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '600',
    color: '#003366',
    marginLeft: Platform.OS === 'web' ? 10 : 8,
  },
});

export default LinkedAccountsScreen;

