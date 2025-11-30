import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator, Platform } from 'react-native'; 

const ProcessingScreen = ({ navigation }) => {
    
  useEffect(() => {
    // 1. Simulação da Chamada à API de Pagamento/Reserva
    const processReservation = async () => {
      console.log('Iniciando processamento da reserva...');
      
      // Simula o tempo de latência da rede e do back-end (3 segundos)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // 2. Lógica para verificar o resultado da transação
      const transactionSuccess = Math.random() > 0.2; // 80% de chance de sucesso
      
      if (transactionSuccess) {
        // Em caso de sucesso: Navega para a tela de confirmação
        navigation.replace('ConfirmationScreen'); 
      } else {
        // Em caso de falha: Exibe um alerta e volta para a tela de reserva
        alert('❌ Falha na transação! Tente novamente ou verifique seu método de pagamento.');
        navigation.goBack(); 
      }
    };

    processReservation();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão de Voltar Desabilitado: NUNCA deve permitir que o usuário volte durante uma transação */}
      {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>...</TouchableOpacity> */}

      <View style={styles.content}>
        
        {/* Ícone de Carregamento */}
        <ActivityIndicator size="large" color="#003366" style={styles.loadingIndicator} />
        
        <Text style={styles.title}>CarrenganGo!</Text>
        <Text style={styles.subtitle}>Processando sua reserva e pagamento...</Text>
        <Text style={styles.warning}>Por favor, não feche o aplicativo.</Text>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf4dc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 0 : 24,
  },
  content: {
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 30 : 24,
  },
  loadingIndicator: {
    transform: [{ scale: Platform.OS === 'web' ? 1.5 : 1.3 }],
    marginBottom: Platform.OS === 'web' ? 40 : 32,
  },
  title: {
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 10 : 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#003366',
    textAlign: 'center',
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    fontWeight: '400',
    lineHeight: Platform.OS === 'web' ? 24 : 22,
  },
  warning: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#E74C3C',
    fontWeight: '700',
    textAlign: 'center',
  }
});

export default ProcessingScreen;