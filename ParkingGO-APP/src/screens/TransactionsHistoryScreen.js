import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';

const TransactionsHistoryScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [transactions, setTransactions] = useState([
    { id: '1', type: 'payment', amount: 15.50, description: 'Estacionamento - Shopping Center', date: '15/01/2024', time: '14:30', status: 'completed', method: 'Cartão de Crédito' },
    { id: '2', type: 'payment', amount: 8.00, description: 'Estacionamento - Centro', date: '14/01/2024', time: '10:15', status: 'completed', method: 'Cartão de Débito' },
    { id: '3', type: 'refund', amount: 12.00, description: 'Reembolso - Estacionamento', date: '13/01/2024', time: '16:45', status: 'completed', method: 'Cartão de Crédito' },
    { id: '4', type: 'payment', amount: 20.00, description: 'Estacionamento - Aeroporto', date: '12/01/2024', time: '08:20', status: 'pending', method: 'PIX' },
    { id: '5', type: 'payment', amount: 5.50, description: 'Estacionamento - Praia', date: '11/01/2024', time: '18:00', status: 'completed', method: 'Cartão de Crédito' },
  ]);

  useEffect(() => {
    const loadTransactions = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await new Promise(resolve => setTimeout(resolve, 700));
      setIsLoading(false);
    };
    loadTransactions();
  }, []);

  const filteredTransactions = selectedFilter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === selectedFilter);

  const formatAmount = (amount, type) => {
    const sign = type === 'refund' ? '+' : '-';
    return `${sign} R$ ${amount.toFixed(2)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#2ECC71';
      case 'pending':
        return '#F39C12';
      case 'failed':
        return '#E74C3C';
      default:
        return '#666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  const handleExport = () => {
    Alert.alert('Exportar', 'Funcionalidade em desenvolvimento');
  };

  if (isLoading) {
    return <LoadingScreen message="Carregando transações..." />;
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
          <Text style={styles.headerTitle}>Histórico de Transações</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
              Todas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'completed' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('completed')}
          >
            <Text style={[styles.filterText, selectedFilter === 'completed' && styles.filterTextActive]}>
              Concluídas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === 'pending' && styles.filterButtonActive]}
            onPress={() => setSelectedFilter('pending')}
          >
            <Text style={[styles.filterText, selectedFilter === 'pending' && styles.filterTextActive]}>
              Pendentes
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumo do Mês</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Gasto</Text>
              <Text style={styles.summaryValue}>R$ {transactions.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0).toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Transações</Text>
              <Text style={styles.summaryValue}>{filteredTransactions.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.transactionsContainer}>
          {filteredTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Nenhuma transação encontrada</Text>
            </View>
          ) : (
            filteredTransactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <View style={styles.transactionIconContainer}>
                    <Ionicons
                      name={transaction.type === 'refund' ? 'arrow-back-circle-outline' : 'arrow-forward-circle-outline'}
                      size={32}
                      color={transaction.type === 'refund' ? '#2ECC71' : '#003366'}
                    />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                    <Text style={styles.transactionDate}>
                      {transaction.date} às {transaction.time}
                    </Text>
                    <Text style={styles.transactionMethod}>{transaction.method}</Text>
                  </View>
                  <View style={styles.transactionAmountContainer}>
                    <Text style={[
                      styles.transactionAmount,
                      { color: transaction.type === 'refund' ? '#2ECC71' : '#000' }
                    ]}>
                      {formatAmount(transaction.amount, transaction.type)}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                        {getStatusText(transaction.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
          <Ionicons name="download-outline" size={20} color="#003366" />
          <Text style={styles.exportButtonText}>Exportar Histórico</Text>
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
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    gap: Platform.OS === 'web' ? 12 : 8,
  },
  filterButton: {
    flex: 1,
    padding: Platform.OS === 'web' ? 12 : 10,
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    backgroundColor: '#FFF',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  filterText: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#666',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  summaryCard: {
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 20 : 18,
    borderRadius: Platform.OS === 'web' ? 10 : 16,
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 16 : 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#666',
    marginBottom: Platform.OS === 'web' ? 6 : 4,
  },
  summaryValue: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '700',
    color: '#003366',
  },
  transactionsContainer: {
    marginBottom: Platform.OS === 'web' ? 20 : 16,
  },
  transactionCard: {
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 18 : 16,
    borderRadius: Platform.OS === 'web' ? 10 : 16,
    marginBottom: Platform.OS === 'web' ? 16 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  transactionIconContainer: {
    marginRight: Platform.OS === 'web' ? 15 : 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: Platform.OS === 'web' ? 6 : 4,
  },
  transactionDate: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#666',
    marginBottom: Platform.OS === 'web' ? 4 : 2,
  },
  transactionMethod: {
    fontSize: Platform.OS === 'web' ? 12 : 11,
    color: '#999',
  },
  transactionAmountContainer: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    marginBottom: Platform.OS === 'web' ? 6 : 4,
  },
  statusBadge: {
    paddingHorizontal: Platform.OS === 'web' ? 10 : 8,
    paddingVertical: Platform.OS === 'web' ? 4 : 2,
    borderRadius: Platform.OS === 'web' ? 6 : 4,
  },
  statusText: {
    fontSize: Platform.OS === 'web' ? 11 : 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Platform.OS === 'web' ? 60 : 40,
  },
  emptyText: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#999',
    marginTop: Platform.OS === 'web' ? 16 : 12,
  },
  exportButton: {
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 16 : 14,
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#003366',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exportButtonText: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '600',
    color: '#003366',
    marginLeft: Platform.OS === 'web' ? 10 : 8,
  },
});

export default TransactionsHistoryScreen;

