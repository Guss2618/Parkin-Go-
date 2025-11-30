import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';

const CardScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const loadCards = async () => {
      // Força uma atualização visual
      await new Promise(resolve => setTimeout(resolve, 100));
      // Simula o carregamento dos cartões
      await new Promise(resolve => setTimeout(resolve, 800));
      setCards([
    {
      id: 1,
      type: 'Visa',
      number: '**** **** **** 1234',
      holder: 'JOÃO SILVA',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Mastercard',
      number: '**** **** **** 5678',
      holder: 'JOÃO SILVA',
      expiry: '06/26',
      isDefault: false,
    },
      ]);
      setIsLoading(false);
    };
    loadCards();
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Carregando cartões..." />;
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
          <Text style={styles.headerTitle}>Meus Cartões</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Cartões Cadastrados</Text>

        {cards.map((card) => (
          <View key={card.id} style={[styles.cardContainer, card.isDefault && styles.cardDefault]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardType}>{card.type}</Text>
              {card.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultText}>PADRÃO</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardNumber}>{card.number}</Text>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>Titular</Text>
                <Text style={styles.cardValue}>{card.holder}</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>Validade</Text>
                <Text style={styles.cardValue}>{card.expiry}</Text>
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#003366" />
          <Text style={styles.addButtonText}>Adicionar Novo Cartão</Text>
        </TouchableOpacity>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Informações</Text>
          <Text style={styles.infoText}>
            Seus cartões são armazenados de forma segura e criptografada. 
            Você pode adicionar, remover ou definir um cartão como padrão a qualquer momento.
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
    backgroundColor: '#a1d5ff',
    paddingTop: Platform.OS === 'web' ? 40 : Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: Platform.OS === 'web' ? 20 : 16,
    paddingHorizontal: Platform.OS === 'web' ? 20 : 16,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    padding: Platform.OS === 'web' ? 5 : 8,
    paddingTop: Platform.OS === 'web' ? 5 : Platform.OS === 'ios' ? 12 : 60,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  backText: {
    fontSize: Platform.OS === 'web' ? 24 : 22,
    color: '#000',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: '700',
    color: '#000',
  },
  scrollContent: {
    padding: Platform.OS === 'web' ? 20 : 16,
    paddingBottom: Platform.OS === 'web' ? 20 : 24,
  },
  sectionTitle: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 20 : 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: Platform.OS === 'web' ? 15 : 16,
    padding: Platform.OS === 'web' ? 20 : 18,
    marginBottom: Platform.OS === 'web' ? 15 : 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardDefault: {
    borderColor: '#003366',
    backgroundColor: '#f0f8ff',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 20 : 16,
  },
  cardType: {
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    color: '#003366',
  },
  defaultBadge: {
    backgroundColor: '#003366',
    paddingHorizontal: Platform.OS === 'web' ? 10 : 8,
    paddingVertical: Platform.OS === 'web' ? 4 : 3,
    borderRadius: Platform.OS === 'web' ? 5 : 6,
  },
  defaultText: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 10 : 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardNumber: {
    fontSize: Platform.OS === 'web' ? 24 : 22,
    fontWeight: '700',
    color: '#000',
    letterSpacing: Platform.OS === 'web' ? 2 : 1.5,
    marginBottom: Platform.OS === 'web' ? 20 : 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    fontSize: Platform.OS === 'web' ? 12 : 11,
    color: '#666',
    marginBottom: Platform.OS === 'web' ? 5 : 4,
    fontWeight: '400',
  },
  cardValue: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '600',
    color: '#000',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Platform.OS === 'web' ? 15 : 16,
    padding: Platform.OS === 'web' ? 20 : 18,
    marginTop: Platform.OS === 'web' ? 10 : 8,
    marginBottom: Platform.OS === 'web' ? 30 : 24,
    borderWidth: 2,
    borderColor: '#003366',
    borderStyle: 'dashed',
    minHeight: Platform.OS === 'web' ? 56 : 52,
  },
  addButtonText: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '700',
    color: '#003366',
    marginLeft: Platform.OS === 'web' ? 10 : 8,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: Platform.OS === 'web' ? 15 : 16,
    padding: Platform.OS === 'web' ? 20 : 18,
    marginTop: Platform.OS === 'web' ? 10 : 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTitle: {
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 10 : 8,
  },
  infoText: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#666',
    lineHeight: Platform.OS === 'web' ? 20 : 19,
    fontWeight: '400',
  },
});

export default CardScreen;

