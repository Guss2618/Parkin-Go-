import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { registerUser, loginUser, saveLoggedInUser } from '../api/auth';
import LoadingScreen from '../components/LoadingScreen';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(''); // 'weak', 'medium', 'strong'
  const [passwordMatch, setPasswordMatch] = useState(null); // null, true, false
  const [passwordFeedback, setPasswordFeedback] = useState([]); // Array de mensagens de feedback

  // Função para verificar critérios da senha e retornar feedback
  const getPasswordFeedback = (pwd) => {
    if (!pwd || pwd.length === 0) {
      setPasswordFeedback([]);
      return [];
    }

    const feedback = [];
    
    // Comprimento mínimo
    if (pwd.length < 8) {
      feedback.push('Pelo menos 8 caracteres');
    }
    
    // Caracteres minúsculos
    if (!/[a-z]/.test(pwd)) {
      feedback.push('Letras minúsculas');
    }
    
    // Caracteres maiúsculos
    if (!/[A-Z]/.test(pwd)) {
      feedback.push('Letras maiúsculas');
    }
    
    // Números
    if (!/[0-9]/.test(pwd)) {
      feedback.push('Números');
    }
    
    // Caracteres especiais
    if (!/[^a-zA-Z0-9]/.test(pwd)) {
      feedback.push('Caracteres especiais (!@#$%^&*)');
    }

    setPasswordFeedback(feedback);
    return feedback;
  };

  // Função para calcular a força da senha
  const calculatePasswordStrength = (pwd) => {
    if (!pwd || pwd.length === 0) {
      setPasswordStrength('');
      return;
    }

    let strength = 0;
    
    // Comprimento
    if (pwd.length >= 8) strength += 1;
    if (pwd.length >= 12) strength += 1;
    
    // Caracteres minúsculos
    if (/[a-z]/.test(pwd)) strength += 1;
    
    // Caracteres maiúsculos
    if (/[A-Z]/.test(pwd)) strength += 1;
    
    // Números
    if (/[0-9]/.test(pwd)) strength += 1;
    
    // Caracteres especiais
    if (/[^a-zA-Z0-9]/.test(pwd)) strength += 1;

    if (strength <= 2) {
      setPasswordStrength('weak');
    } else if (strength <= 4) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('strong');
    }
  };

  // Função para verificar se as senhas coincidem
  const checkPasswordMatch = (pwd, confirmPwd) => {
    if (!confirmPwd || confirmPwd.length === 0) {
      setPasswordMatch(null);
      return;
    }
    
    if (pwd === confirmPwd && pwd.length > 0) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    calculatePasswordStrength(text);
    getPasswordFeedback(text);
    checkPasswordMatch(text, confirmPassword);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    checkPasswordMatch(password, text);
  };

  const handleRegister = async () => {
    console.log('--- Botão CADASTRAR pressionado. Iniciando validação. ---'); 
    
    // 1. Validação de Campos
    if (!username || !email || !password || !confirmPassword) {
        Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }
    
    setIsLoading(true); // Inicia o estado de carregamento
    // Força uma atualização visual
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
        // 2. CHAMA A FUNÇÃO DA API
        const result = await registerUser(username, email, password);

        if (result.success) {
            // 3. Faz login automático após cadastro
            const loginResult = await loginUser(email, password);
            
            if (loginResult.success) {
                // Salva o usuário logado
                await saveLoggedInUser(loginResult.user);
                Alert.alert('Sucesso', 'Cadastro realizado com sucesso! Bem-vindo(a) ao Parking Go!');
                // Navega para a tela principal (HomeMap)
                navigation.navigate('HomeMap'); 
            } else {
                Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
                navigation.navigate('HomeMap');
            }
        } else {
            // Exibe a mensagem de erro da API
            Alert.alert('Erro ao Cadastrar', result.error);
        }
    } catch (error) {
        // Erro de rede ou erro inesperado
        Alert.alert('Erro Grave', 'Não foi possível conectar ao servidor. Tente novamente.');
    } finally {
        setIsLoading(false); // Finaliza o estado de carregamento, mesmo em caso de erro
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Criando conta..." />;
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

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Cadastro</Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Usuário"
              placeholderTextColor="#999"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                passwordStrength === 'weak' && styles.inputWeak,
                passwordStrength === 'medium' && styles.inputMedium,
                passwordStrength === 'strong' && styles.inputStrong,
              ]}
              placeholder="Senha"
              placeholderTextColor="#999"
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry
            />
            {passwordStrength && (
              <View style={styles.strengthIndicator}>
                <View style={[
                  styles.strengthBar,
                  passwordStrength === 'weak' && styles.strengthBarWeak,
                  passwordStrength === 'medium' && styles.strengthBarMedium,
                  passwordStrength === 'strong' && styles.strengthBarStrong,
                ]} />
              </View>
            )}
            {password.length > 0 && passwordFeedback.length > 0 && (
              <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackTitle}>Adicione para fortalecer:</Text>
                {passwordFeedback.map((item, index) => (
                  <View key={index} style={styles.feedbackItem}>
                    <Ionicons name="close-circle" size={14} color="#E74C3C" style={styles.feedbackIcon} />
                    <Text style={styles.feedbackText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}
            {password.length > 0 && passwordFeedback.length === 0 && (
              <View style={styles.feedbackContainer}>
                <View style={styles.feedbackItem}>
                  <Ionicons name="checkmark-circle" size={14} color="#2ECC71" style={styles.feedbackIcon} />
                  <Text style={styles.feedbackSuccessText}>Senha forte! Todos os critérios atendidos.</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.input,
                passwordMatch === true && styles.inputMatch,
                passwordMatch === false && styles.inputNoMatch,
              ]}
              placeholder="Confirmar Senha"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              secureTextEntry
            />
            {confirmPassword.length > 0 && (
              <View style={styles.matchIndicator}>
                {passwordMatch ? (
                  <Ionicons name="checkmark-circle" size={20} color="#2ECC71" />
                ) : (
                  <Ionicons name="close-circle" size={20} color="#E74C3C" />
                )}
              </View>
            )}
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>CADASTRAR</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
            <Text style={styles.linkText}>Já tem conta? Faça login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Platform.OS === 'web' ? 20 : 40,
  },
  card: {
    margin: Platform.OS === 'web' ? 20 : 20,
    marginTop: Platform.OS === 'web' ? 50 : 20,
    marginBottom: Platform.OS === 'web' ? 20 : 20,
    padding: Platform.OS === 'web' ? 30 : 32,
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
    fontSize: Platform.OS === 'web' ? 28 : 26,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 40 : 36,
    marginTop: Platform.OS === 'web' ? 0 : 8,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: Platform.OS === 'web' ? 20 : 24,
  },
  passwordContainer: {
    width: '100%',
    marginBottom: Platform.OS === 'web' ? 20 : 24,
    position: 'relative',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 15 : 18,
    paddingVertical: Platform.OS === 'web' ? 15 : 18,
    borderRadius: Platform.OS === 'web' ? 10 : 14,
    borderColor: '#e0e0e0',
    borderWidth: 2,
    fontSize: Platform.OS === 'web' ? 16 : 16,
    color: '#000',
    minHeight: Platform.OS === 'web' ? 50 : 56,
  },
  inputWeak: {
    borderColor: '#E74C3C',
  },
  inputMedium: {
    borderColor: '#F39C12',
  },
  inputStrong: {
    borderColor: '#2ECC71',
  },
  inputMatch: {
    borderColor: '#2ECC71',
  },
  inputNoMatch: {
    borderColor: '#E74C3C',
  },
  strengthIndicator: {
    marginTop: Platform.OS === 'web' ? 6 : 8,
    height: 4,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.3s ease',
  },
  strengthBarWeak: {
    width: '33%',
    backgroundColor: '#E74C3C',
  },
  strengthBarMedium: {
    width: '66%',
    backgroundColor: '#F39C12',
  },
  strengthBarStrong: {
    width: '100%',
    backgroundColor: '#2ECC71',
  },
  matchIndicator: {
    position: 'absolute',
    right: Platform.OS === 'web' ? 12 : 14,
    top: Platform.OS === 'web' ? 18 : 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackContainer: {
    marginTop: Platform.OS === 'web' ? 8 : 10,
    width: '100%',
  },
  feedbackTitle: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: Platform.OS === 'web' ? 6 : 8,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 4 : 6,
  },
  feedbackIcon: {
    marginRight: Platform.OS === 'web' ? 6 : 8,
  },
  feedbackText: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#666',
    flex: 1,
  },
  feedbackSuccessText: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#2ECC71',
    fontWeight: '600',
    flex: 1,
  },
  button: {
    backgroundColor: '#003366',
    padding: Platform.OS === 'web' ? 15 : 18,
    paddingVertical: Platform.OS === 'web' ? 15 : 18,
    borderRadius: Platform.OS === 'web' ? 30 : 28,
    width: Platform.OS === 'web' ? '80%' : '100%',
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 10 : 16,
    marginBottom: Platform.OS === 'web' ? 20 : 12,
    minHeight: Platform.OS === 'web' ? 50 : 58,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    letterSpacing: Platform.OS === 'web' ? 1 : 0.5,
  },
  linkContainer: {
    marginTop: Platform.OS === 'web' ? 0 : 8,
    paddingVertical: Platform.OS === 'web' ? 0 : 8,
  },
  linkText: {
    color: '#003366',
    fontSize: Platform.OS === 'web' ? 14 : 14,
    fontWeight: '500',
  },
});

export default RegisterScreen;