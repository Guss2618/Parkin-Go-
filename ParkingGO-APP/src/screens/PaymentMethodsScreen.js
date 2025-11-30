import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';

const PaymentMethodsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', type: 'credit', number: '**** **** **** 1234', name: 'Cartão de Crédito', brand: 'Visa', expiry: '12/25', isDefault: true },
    { id: '2', type: 'debit', number: '**** **** **** 5678', name: 'Cartão de Débito', brand: 'Mastercard', expiry: '08/26', isDefault: false },
  ]);

  useEffect(() => {
    const loadPayments = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await new Promise(resolve => setTimeout(resolve, 700));
      setIsLoading(false);
    };
    loadPayments();
  }, []);

  const handleSetDefault = (id) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })));
    Alert.alert('Sucesso', 'Método de pagamento padrão atualizado!');
  };

  const handleRemove = (id) => {
    Alert.alert(
      'Remover Método de Pagamento',
      'Tem certeza que deseja remover este método de pagamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(paymentMethods.filter(method => method.id !== id));
            Alert.alert('Sucesso', 'Método de pagamento removido!');
          },
        },
      ]
    );
  };

  const handleAddPayment = () => {
    Alert.alert('Adicionar Pagamento', 'Funcionalidade em desenvolvimento');
  };

  if (isLoading) {
    return <LoadingScreen message="Carregando métodos de pagamento..." />;
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
          <Text style={styles.headerTitle}>Métodos de Pagamento</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Gerencie seus métodos de pagamento. Você pode adicionar, editar ou remover cartões. Todos os dados são protegidos com criptografia SSL.
          </Text>
        </View>

        <View style={styles.paymentsContainer}>
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <View style={styles.cardIconContainer}>
                  <Ionicons name="card-outline" size={32} color="#003366" />
                </View>
                <View style={styles.paymentInfo}>
                  <View style={styles.paymentTitleRow}>
                    <Text style={styles.paymentName}>{method.name}</Text>
                    {method.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultText}>PADRÃO</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.paymentNumber}>{method.number}</Text>
                  <View style={styles.paymentDetails}>
                    <Text style={styles.paymentDetail}>{method.brand}</Text>
                    <Text style={styles.paymentDetail}>•</Text>
                    <Text style={styles.paymentDetail}>Expira em {method.expiry}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.paymentActions}>
                {!method.isDefault && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleSetDefault(method.id)}
                  >
                    <Ionicons name="star-outline" size={20} color="#003366" />
                    <Text style={styles.actionText}>Definir como padrão</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(method.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddPayment}>
          <Ionicons name="add-circle-outline" size={24} color="#003366" />
          <Text style={styles.addButtonText}>Adicionar Método de Pagamento</Text>
        </TouchableOpacity>

        <View style={styles.securityInfo}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#2ECC71" />
          <Text style={styles.securityText}>
            Seus dados de pagamento são protegidos com criptografia de ponta a ponta
          </Text>
        </View>
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
  paymentsContainer: {
    marginBottom: Platform.OS === 'web' ? 20 : 16,
  },
  paymentCard: {
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
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 16 : 12,
  },
  cardIconContainer: {
    width: Platform.OS === 'web' ? 56 : 52,
    height: Platform.OS === 'web' ? 56 : 52,
    borderRadius: Platform.OS === 'web' ? 28 : 26,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Platform.OS === 'web' ? 15 : 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 6 : 4,
  },
  paymentName: {
    fontSize: Platform.OS === 'web' ? 17 : 16,
    fontWeight: '700',
    color: '#003366',
    marginRight: Platform.OS === 'web' ? 10 : 8,
  },
  defaultBadge: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: Platform.OS === 'web' ? 8 : 6,
    paddingVertical: Platform.OS === 'web' ? 4 : 2,
    borderRadius: Platform.OS === 'web' ? 4 : 3,
  },
  defaultText: {
    fontSize: Platform.OS === 'web' ? 10 : 9,
    fontWeight: '700',
    color: '#FFF',
  },
  paymentNumber: {
    fontSize: Platform.OS === 'web' ? 15 : 14,
    color: '#000',
    fontWeight: '600',
    marginBottom: Platform.OS === 'web' ? 6 : 4,
    letterSpacing: Platform.OS === 'web' ? 2 : 1,
  },
  paymentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentDetail: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#666',
    marginRight: Platform.OS === 'web' ? 8 : 6,
  },
  paymentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'web' ? 12 : 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Platform.OS === 'web' ? 16 : 12,
    padding: Platform.OS === 'web' ? 8 : 6,
  },
  actionText: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#003366',
    marginLeft: Platform.OS === 'web' ? 6 : 4,
    fontWeight: '500',
  },
  removeButton: {
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
    marginBottom: Platform.OS === 'web' ? 20 : 16,
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
  securityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: Platform.OS === 'web' ? 14 : 12,
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    borderWidth: 1,
    borderColor: '#2ECC71',
  },
  securityText: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#2ECC71',
    marginLeft: Platform.OS === 'web' ? 10 : 8,
    flex: 1,
  },
});

export default PaymentMethodsScreen;

