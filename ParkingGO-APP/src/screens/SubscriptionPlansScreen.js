import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen'; 

const subscriptionPlans = [
  { 
    id: 'free', 
    name: 'FREE', 
    price: 'R$ 0,00 / mês', 
    description: 'Acesso básico e buscas limitadas.',
    benefits: [
      'Busca de estacionamentos', 
      'Informação de fluxo de vagas (CHEIO/LIVRE)', 
      'Suporte padrão'
    ] 
  },
  { 
    id: 'vip', 
    name: 'VIP', 
    price: 'R$ 19,90 / mês', 
    description: 'Acesso a detalhes em tempo real e descontos.',
    benefits: [
      'Tudo do Plano FREE', 
      'Visualização da quantidade de vagas disponíveis (Ex: 12 Vagas)', 
      '5% de desconto em todas as reservas', 
      'Alertas de baixa disponibilidade'
    ] 
  },
  { 
    id: 'mvp_plus', 
    name: 'MVP+', 
    price: 'R$ 39,90 / mês', 
    description: 'Experiência completa com reservas prioritárias.',
    benefits: [
      'Tudo do Plano VIP', 
      'Reservar vaga diretamente pelo mapa (Ação Rápida)', 
      '10% de desconto em todas as reservas', 
      'Suporte prioritário 24/7'
    ] 
  },
];

const SubscriptionPlansScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState('vip'); // Plano VIP como padrão inicial (simulando destaque na imagem)
  const selectedPlan = subscriptionPlans.find(p => p.id === selectedPlanId);

  useEffect(() => {
    const loadPlans = async () => {
      // Força uma atualização visual
      await new Promise(resolve => setTimeout(resolve, 100));
      // Simula o carregamento dos planos
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoading(false);
    };
    loadPlans();
  }, []);

  // Componente para renderizar os botões de plano
  const PlanButton = ({ plan }) => {
    const isSelected = plan.id === selectedPlanId;
    return (
      <TouchableOpacity 
        style={[styles.planButton, isSelected ? styles.planButtonSelected : styles.planButtonDefault]}
        onPress={() => setSelectedPlanId(plan.id)}
      >
        <Text style={[styles.planText, isSelected ? styles.planTextSelected : styles.planTextDefault]}>
          {plan.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSubscribe = () => {
    if (selectedPlanId === 'free') {
      alert('Seu plano FREE está ativo!');
      navigation.goBack(); // Volta para a tela de configurações
    } else {
      // Lógica de navegação para a tela de pagamento e checkout
      console.log(`Iniciando checkout para o plano: ${selectedPlan.name}`);
      // navigation.navigate('PaymentCheckout', { plan: selectedPlan });
      alert(`Você será redirecionado para o checkout do plano ${selectedPlan.name}.`);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Carregando planos..." />;
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
          <Text style={styles.headerTitle}>Planos de Assinatura</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.mainTitle}>ESCOLHA O MELHOR PLANO PARA VOCÊ</Text>

        {/* --- Seleção de Botões --- */}
        <View style={styles.planSelectionContainer}>
          {subscriptionPlans.map(plan => <PlanButton key={plan.id} plan={plan} />)}
        </View>

        {/* --- Detalhes do Plano Selecionado --- */}
        {selectedPlan && (
          <View style={styles.detailsCard}>
            <Text style={styles.detailTitle}>{selectedPlan.name}</Text>
            <Text style={styles.detailPrice}>{selectedPlan.price}</Text>
            <Text style={styles.detailDescription}>{selectedPlan.description}</Text>

            <View style={styles.benefitsContainer}>
              <Text style={styles.benefitsHeader}>O que está incluído:</Text>
              {selectedPlan.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#2ECC71" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* --- Botão de Ação --- */}
        <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
          <Text style={styles.subscribeButtonText}>
            {selectedPlanId === 'free' ? 'PLANO FREE ATUAL' : `ASSINAR ${selectedPlan.name}`}
          </Text>
        </TouchableOpacity>

      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf4dc',
  },
  header: {
    paddingTop: Platform.OS === 'web' ? 15 : Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: Platform.OS === 'web' ? 15 : 16,
    paddingHorizontal: Platform.OS === 'web' ? 15 : 16,
    backgroundColor: '#a1d5ff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '100%',
    alignItems: 'center',
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: '#003366',
    flex: 1,
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: Platform.OS === 'web' ? 20 : 16,
    paddingVertical: Platform.OS === 'web' ? 10 : 16,
    paddingBottom: Platform.OS === 'web' ? 10 : 24,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 30 : 24,
    textAlign: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 0 : 16,
  },
  // --- Botões de Seleção de Plano ---
  planSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: Platform.OS === 'web' ? 30 : 24,
    paddingHorizontal: Platform.OS === 'web' ? 0 : 4,
  },
  planButton: {
    paddingVertical: Platform.OS === 'web' ? 15 : 14,
    paddingHorizontal: Platform.OS === 'web' ? 10 : 8,
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    width: '30%',
    alignItems: 'center',
    borderWidth: 2,
    minHeight: Platform.OS === 'web' ? 50 : 48,
    justifyContent: 'center',
  },
  planButtonDefault: {
    borderColor: '#e0e0e0',
    backgroundColor: '#FFF',
  },
  planButtonSelected: {
    borderColor: '#003366',
    backgroundColor: '#a1d5ff',
  },
  planText: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '700',
  },
  planTextDefault: {
    color: '#333',
  },
  planTextSelected: {
    color: '#003366',
  },
  // --- Detalhes do Plano ---
  detailsCard: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: Platform.OS === 'web' ? 20 : 18,
    borderRadius: Platform.OS === 'web' ? 10 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: Platform.OS === 'web' ? 30 : 24,
  },
  detailTitle: {
    fontSize: Platform.OS === 'web' ? 22 : 20,
    fontWeight: '700',
    color: '#003366',
  },
  detailPrice: {
    fontSize: Platform.OS === 'web' ? 24 : 22,
    fontWeight: '700',
    color: '#2ECC71',
    marginVertical: Platform.OS === 'web' ? 5 : 4,
  },
  detailDescription: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#666',
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    lineHeight: Platform.OS === 'web' ? 20 : 19,
    fontWeight: '400',
  },
  benefitsContainer: {
    marginTop: 10,
  },
  benefitsHeader: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '700',
    marginBottom: Platform.OS === 'web' ? 10 : 12,
    color: '#003366',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 8 : 10,
  },
  benefitText: {
    marginLeft: Platform.OS === 'web' ? 10 : 12,
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#666',
    fontWeight: '400',
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#003366',
    padding: Platform.OS === 'web' ? 18 : 16,
    borderRadius: Platform.OS === 'web' ? 30 : 28,
    width: Platform.OS === 'web' ? '90%' : '100%',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 20 : 24,
    minHeight: Platform.OS === 'web' ? 56 : 52,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  subscribeButtonText: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '700',
    letterSpacing: Platform.OS === 'web' ? 1 : 0.5,
  },
});

export default SubscriptionPlansScreen;