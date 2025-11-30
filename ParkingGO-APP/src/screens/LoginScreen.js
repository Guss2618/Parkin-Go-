import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingScreen from '../components/LoadingScreen';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    
    setIsLoading(true);
    // Força uma atualização visual
    await new Promise(resolve => setTimeout(resolve, 100));
    // Lógica de autenticação com o backend (API ParkinGOV2)
    console.log('Tentativa de Login:', email);
    
    // Simula o tempo de autenticação
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    // Em caso de sucesso: navigation.navigate('HomeMap');
    // Por enquanto, apenas volta
    navigation.goBack();
  };

  if (isLoading) {
    return <LoadingScreen message="Fazendo login..." />;
  }

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
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity onPress={() => navigation.navigate('RecoverPassword')}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
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
    marginBottom: Platform.OS === 'web' ? 40 : 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 15 : 16,
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#000',
  },
  forgotPasswordText: {
    color: '#003366',
    textAlign: 'right',
    width: '100%',
    marginBottom: Platform.OS === 'web' ? 30 : 24,
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#003366',
    padding: Platform.OS === 'web' ? 15 : 16,
    borderRadius: Platform.OS === 'web' ? 30 : 28,
    width: Platform.OS === 'web' ? '80%' : '100%',
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 10 : 8,
    marginBottom: Platform.OS === 'web' ? 20 : 16,
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
  linkText: {
    color: '#003366',
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontWeight: '500',
  }
});

export default LoginScreen;