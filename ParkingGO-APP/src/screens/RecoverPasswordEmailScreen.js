import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecoverPasswordEmailScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleSendEmail = () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira seu e-mail.');
      return;
    }
    
    // 1. Lógica de CHAMADA à API (ParkinGOV2) para enviar o código por e-mail.
    console.log('Solicitando código de recuperação para:', email);

    // 2. Em caso de sucesso da API, navega para a próxima tela, passando o e-mail:
    navigation.navigate('VerifyCode', { userEmail: email });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        {Platform.OS === 'web' ? (
          <Text style={styles.backText}>←</Text>
        ) : (
          <Ionicons name="arrow-back" size={24} color="#000" />
        )}
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Qual seu email?</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleSendEmail}>
          <Text style={styles.buttonText}>Enviar</Text>
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
  backButton: {
    paddingTop: Platform.OS === 'web' ? 15 : Platform.OS === 'ios' ? 12 : 60,
    paddingBottom: Platform.OS === 'web' ? 15 : 12,
    paddingHorizontal: Platform.OS === 'web' ? 15 : 16,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backText: {
    fontSize: Platform.OS === 'web' ? 24 : 22,
    color: '#000',
    fontWeight: 'bold',
  },
  card: {
    margin: Platform.OS === 'web' ? 20 : 16,
    marginTop: Platform.OS === 'web' ? 100 : 24,
    padding: Platform.OS === 'web' ? 30 : 24,
    borderRadius: Platform.OS === 'web' ? 20 : 24,
    backgroundColor: '#a1d5ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 24 : 22,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 40 : 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 15 : 16,
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    marginBottom: Platform.OS === 'web' ? 40 : 32,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#000',
  },
  button: {
    backgroundColor: '#003366',
    padding: Platform.OS === 'web' ? 15 : 16,
    borderRadius: Platform.OS === 'web' ? 30 : 28,
    width: Platform.OS === 'web' ? '80%' : '100%',
    alignItems: 'center',
    minHeight: Platform.OS === 'web' ? 50 : 52,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '700',
    letterSpacing: Platform.OS === 'web' ? 1 : 0.5,
  },
});

export default RecoverPasswordEmailScreen;