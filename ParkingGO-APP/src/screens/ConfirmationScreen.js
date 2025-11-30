import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

// Importar uma biblioteca de QR Code (Exemplo: react-native-qrcode-svg)
// import QRCode from 'react-native-qrcode-svg'; 

// Dados Mock da reserva confirmada (normalmente viria da rota.params)
const mockReservationData = {
  parkingName: 'Estacionamento Central Park',
  address: 'Rua das Flores, 123 - Centro',
  entryTime: '29/11/2025 às 14:00',
  exitTime: '29/11/2025 às 16:00',
  reservationCode: 'PKG-7845-AB23',
  qrCodeValue: '{"code": "PKG-7845-AB23", "user": "user_id_123"}',
  totalPaid: 17.00
};

const ConfirmationScreen = ({ navigation }) => {
  
  const handleGoHome = () => {
    // Retorna para a tela principal (Mapa/Busca)
    navigation.popToTop(); 
    // Ou navigation.navigate('HomeMap');
  };
  
  const handleAddToCalendar = () => {
      alert('Funcionalidade: Adicionar evento ao calendário nativo.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Ionicons name="checkmark-circle" size={Platform.OS === 'web' ? 80 : 72} color="#2ECC71" style={styles.successIcon} />
        <Text style={styles.mainTitle}>RESERVA CONFIRMADA!</Text>
        <Text style={styles.subtitle}>Seu acesso está pronto para uso.</Text>

        <View style={styles.detailCard}>
          <Text style={styles.parkingName}>{mockReservationData.parkingName}</Text>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{mockReservationData.address}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Entrada: {mockReservationData.entryTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Saída: {mockReservationData.exitTime}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="wallet-outline" size={16} color="#666" />
            <Text style={styles.detailText}>Pago: R$ {mockReservationData.totalPaid.toFixed(2)}</Text>
          </View>
        </View>

        {/* --- Área de Acesso (QR Code) --- */}
        <View style={styles.qrCodeArea}>
          <Text style={styles.qrCodeLabel}>Apresente este código na entrada:</Text>
          
          {/* Simulação do QR Code - Use a biblioteca real aqui */}
          <View style={styles.qrCodePlaceholder}>
            {/* <QRCode
                value={mockReservationData.qrCodeValue}
                size={200}
                color="black"
                backgroundColor="white"
              /> 
            */}
            <Text style={{fontSize: 16}}> [Placeholder do QR CODE] </Text>
          </View>
          
          <Text style={styles.reservationCode}>CÓDIGO: {mockReservationData.reservationCode}</Text>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('HomeMap')}>
          <Ionicons name="map-outline" size={20} color="#003366" />
          <Text style={styles.actionButtonText}> Ver no Mapa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleAddToCalendar}>
          <Ionicons name="calendar-outline" size={20} color="#003366" />
          <Text style={styles.actionButtonText}> Adicionar ao Calendário</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Botão Principal de Finalização */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
          <Text style={styles.homeButtonText}>VOLTAR AO INÍCIO</Text>
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
  scrollContent: {
    padding: Platform.OS === 'web' ? 25 : 20,
    paddingTop: Platform.OS === 'web' ? 25 : 24,
    paddingBottom: Platform.OS === 'web' ? 25 : 24,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: Platform.OS === 'web' ? 20 : 16,
  },
  mainTitle: {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 10 : 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 30 : 24,
    textAlign: 'center',
    fontWeight: '400',
  },
  detailCard: {
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 20 : 18,
    borderRadius: Platform.OS === 'web' ? 10 : 16,
    width: '100%',
    marginBottom: Platform.OS === 'web' ? 30 : 24,
    borderLeftWidth: 5,
    borderLeftColor: '#2ECC71',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parkingName: {
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 10 : 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 8 : 10,
  },
  detailText: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#666',
    marginLeft: Platform.OS === 'web' ? 8 : 6,
    fontWeight: '400',
    flex: 1,
  },
  qrCodeArea: {
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 40 : 32,
    width: '100%',
  },
  qrCodeLabel: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 15 : 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  qrCodePlaceholder: {
    width: Platform.OS === 'web' ? 220 : 200,
    height: Platform.OS === 'web' ? 220 : 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Platform.OS === 'web' ? 5 : 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    marginBottom: Platform.OS === 'web' ? 15 : 12,
  },
  reservationCode: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '700',
    color: '#003366',
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 15 : 16,
    borderRadius: Platform.OS === 'web' ? 30 : 28,
    width: '100%',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'web' ? 15 : 12,
    borderWidth: 2,
    borderColor: '#003366',
    minHeight: Platform.OS === 'web' ? 50 : 52,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#003366',
    fontWeight: '700',
    marginLeft: Platform.OS === 'web' ? 5 : 8,
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
  homeButton: {
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
  homeButtonText: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '700',
    letterSpacing: Platform.OS === 'web' ? 1 : 0.5,
  }
});

export default ConfirmationScreen;