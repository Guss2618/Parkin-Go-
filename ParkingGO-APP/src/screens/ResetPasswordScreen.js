import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ResetPasswordScreen = ({ navigation, route }) => {
  // Recebe o email da tela anterior
  const { userEmail } = route.params || {};

  const [code, setCode] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Refs para controle de foco nos campos de código
  const codeInputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Mudar o foco automaticamente para o próximo campo
    if (text && index < 3) {
      codeInputs[index + 1].current.focus();
    }
  };

  const handleResetPassword = () => {
    const verificationCode = code.join('');

    if (verificationCode.length !== 4) {
        Alert.alert('Erro', 'Por favor, insira o código completo.');
        return;
    }
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Erro', 'As novas senhas não coincidem!');
      return;
    }
    
    // 1. Lógica de CHAMADA à API para validar o código e redefinir a senha
    console.log('Redefinindo senha para:', userEmail, 'com código:', verificationCode);
    
    // 2. Em caso de sucesso:
    // navigation.navigate('Login'); // Volta para o login
    Alert.alert('Sucesso', 'Sua senha foi redefinida com sucesso!');
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
        <Text style={styles.title}>Redefinir Senha</Text>
        
        <Text style={styles.instructionText}>
          Enviamos um código para o seu email. Por favor verifique sua caixa de entrada ou spam
        </Text>

        {/* Campos de Entrada de Código */}
        <View style={styles.codeInputContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={codeInputs[index]}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <TouchableOpacity onPress={() => console.log('Reenviando código para:', userEmail)} style={styles.resendButton}>
          <Text style={styles.resendText}>Não recebeu o código? Reenviar</Text>
        </TouchableOpacity>

        {/* Campos da Nova Senha */}
        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar Nova Senha"
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>REDEFINIR</Text>
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
    marginTop: Platform.OS === 'web' ? 50 : 24,
    padding: Platform.OS === 'web' ? 30 : 24,
    borderRadius: Platform.OS === 'web' ? 20 : 24,
    backgroundColor: '#a1d5ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    textAlign: 'center',
  },
  instructionText: {
    textAlign: 'center',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 30 : 24,
    lineHeight: Platform.OS === 'web' ? 20 : 19,
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontWeight: '400',
    paddingHorizontal: Platform.OS === 'web' ? 0 : 8,
  },
  codeInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Platform.OS === 'web' ? '80%' : '100%',
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    paddingHorizontal: Platform.OS === 'web' ? 0 : 8,
  },
  codeInput: {
    width: Platform.OS === 'web' ? 50 : 56,
    height: Platform.OS === 'web' ? 50 : 56,
    backgroundColor: '#FFF',
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    fontSize: Platform.OS === 'web' ? 20 : 22,
    fontWeight: '700',
    color: '#003366',
  },
  resendButton: {
    marginBottom: Platform.OS === 'web' ? 30 : 24,
    padding: Platform.OS === 'web' ? 0 : 8,
  },
  resendText: {
    color: '#003366',
    textDecorationLine: 'underline',
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 15 : 16,
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    marginBottom: Platform.OS === 'web' ? 15 : 16,
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
    marginTop: Platform.OS === 'web' ? 20 : 16,
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

export default ResetPasswordScreen;