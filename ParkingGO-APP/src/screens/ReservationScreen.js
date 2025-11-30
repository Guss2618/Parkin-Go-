import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
// OBS: Para uma experiência real, você precisaria de um componente de data/hora como @react-native-community/datetimepicker

// Dados Mock (simulando que a tela recebeu o ID do estacionamento)
const mockParkingData = {
  name: 'Continente Shopping',
  pricePerHour: 8.50, // Exemplo de tarifa
  accepts: ['Visa', 'Mastercard', 'ApplePay'],
  illustration: 'URL_DA_ILUSTRACAO_CARRO', // Substituir por require('./path/to/image.png')
};

const ReservationScreen = ({ navigation, route }) => {
  const parkingId = route.params?.parkingId || 1; // ID real do estacionamento
  const [entryTime, setEntryTime] = useState(new Date(Date.now() + 3600000)); // Simula entrada daqui a 1 hora
  const [exitTime, setExitTime] = useState(new Date(Date.now() + 7200000)); // Simula saída daqui a 2 horas
  const [totalValue, setTotalValue] = useState(0);

  // Função para calcular o valor total
  const calculateTotal = () => {
    const durationMs = exitTime.getTime() - entryTime.getTime();
    if (durationMs <= 0) {
      setTotalValue(0);
      return;
    }
    
    // Simplesmente calcula as horas e multiplica pela tarifa
    const durationHours = durationMs / (1000 * 60 * 60);
    const calculatedValue = durationHours * mockParkingData.pricePerHour;
    
    setTotalValue(calculatedValue.toFixed(2));
  };

  useEffect(() => {
    calculateTotal();
  }, [entryTime, exitTime]);
  
  // Função que seria chamada para abrir o seletor de data/hora
  const showTimePicker = (isEntry) => {
    // Aqui você integraria um componente como DateTimePicker para escolher a hora.
    alert(`Abrindo seletor para Hora de ${isEntry ? 'Entrada' : 'Saída'}`);
    // Após a seleção, chame setEntryTime ou setExitTime com a nova data.
  };

  const handleReservation = () => {
    if (totalValue <= 0) {
      alert('Selecione um horário de saída posterior ao de entrada.');
      return;
    }
    // 1. Enviar dados de reserva para o back-end (ParkinGOV2)
    console.log('Reservando:', mockParkingData.name, 'Valor:', totalValue);

    // 2. Navegar para a tela de Carregamento/Processamento
    navigation.navigate('ProcessingScreen'); 
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

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
          <Text style={styles.headerTitle}>Parking Go!</Text>
          <View style={{ width: 44 }} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Card de Reserva */}
        <View style={styles.reservationCard}>
          <View>
            <Text style={styles.cardTitle}>Horários:</Text>
            
            <TouchableOpacity style={styles.timeSelector} onPress={() => showTimePicker(true)}>
              <Text style={styles.selectorText}>Entrada: {formatTime(entryTime)}</Text>
              <Ionicons name="chevron-down" size={20} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.timeSelector} onPress={() => showTimePicker(false)}>
              <Text style={styles.selectorText}>Saída: {formatTime(exitTime)}</Text>
              <Ionicons name="chevron-down" size={20} color="#333" />
            </TouchableOpacity>

            <View style={styles.valueSection}>
              <Text style={styles.cardTitle}>Valor:</Text>
              <Text style={styles.totalValueText}>R$ {totalValue}</Text>
            </View>

            <View style={styles.paymentIcons}>
              {/* Ícones de pagamento (Simulados) */}
              {mockParkingData.accepts.map((method, index) => (
                <Text key={index} style={styles.paymentText}>{method} | </Text> 
              ))}
            </View>
          </View>

          {/* Ilustração (Substitua pela imagem real) */}
          <View style={styles.imagePlaceholder}>
            <Text> [Imagem da Vaga] </Text>
          </View>
        </View>
        
      </ScrollView>

      {/* Botão de Ação (Fixo na parte inferior) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleReservation}>
          <Text style={styles.confirmButtonText}>CONFIRMAR RESERVA (R$ {totalValue})</Text>
        </TouchableOpacity>
      </View>
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
    position: 'relative',
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
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    color: '#003366',
  },
  scrollContent: {
    padding: Platform.OS === 'web' ? 20 : 16,
    paddingBottom: Platform.OS === 'web' ? 20 : 24,
    alignItems: 'center',
  },
  reservationCard: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 20 : 18,
    borderRadius: Platform.OS === 'web' ? 10 : 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: Platform.OS === 'web' ? 0 : 16,
  },
  cardTitle: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 5 : 8,
  },
  timeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: Platform.OS === 'web' ? 10 : 14,
    borderRadius: Platform.OS === 'web' ? 8 : 12,
    width: Platform.OS === 'web' ? 150 : '100%',
    marginBottom: Platform.OS === 'web' ? 15 : 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectorText: {
    fontSize: Platform.OS === 'web' ? 14 : 15,
    color: '#000',
    fontWeight: '500',
  },
  valueSection: {
    marginTop: Platform.OS === 'web' ? 10 : 8,
  },
  totalValueText: {
    fontSize: Platform.OS === 'web' ? 24 : 22,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 10 : 8,
  },
  paymentIcons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Platform.OS === 'web' ? 10 : 8,
  },
  paymentText: {
    fontSize: Platform.OS === 'web' ? 12 : 11,
    color: '#666',
    fontWeight: '400',
  },
  imagePlaceholder: {
    flex: Platform.OS === 'web' ? 1 : 0,
    height: Platform.OS === 'web' ? 200 : 180,
    backgroundColor: '#f0f0f0',
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    marginLeft: Platform.OS === 'web' ? 10 : 0,
    marginTop: Platform.OS === 'web' ? 0 : 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: Platform.OS === 'web' ? 'auto' : '100%',
  },
  footer: {
    padding: Platform.OS === 'web' ? 15 : 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmButton: {
    backgroundColor: '#003366',
    padding: Platform.OS === 'web' ? 18 : 16,
    borderRadius: Platform.OS === 'web' ? 30 : 28,
    alignItems: 'center',
    minHeight: Platform.OS === 'web' ? 56 : 52,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '700',
    letterSpacing: Platform.OS === 'web' ? 1 : 0.5,
  }
});

export default ReservationScreen;