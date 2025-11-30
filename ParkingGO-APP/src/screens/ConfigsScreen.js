import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';
import LinearGradient from '../components/LinearGradient';
import { loginUser, getLoggedInUser, removeLoggedInUser } from '../api/auth'; 

const ConfigsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Usuário de Exemplo',
    email: 'email@gmail.com',
    id: 'Cbkb134huinU32nwe3',
  });

  useEffect(() => {
    const loadConfigs = async () => {
      // Força uma atualização visual
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verifica se há usuário logado
      const loggedInUser = await getLoggedInUser();
      
      if (loggedInUser) {
        // Usuário já está logado
        setIsAuthenticated(true);
        setUserInfo({
          name: loggedInUser.username || 'Usuário',
          email: loggedInUser.email,
          id: loggedInUser.id,
        });
      }
      
      // Simula o carregamento das configurações
      await new Promise(resolve => setTimeout(resolve, 700));
      setIsLoading(false);
    };
    loadConfigs();
  }, []);

  const handleLogin = async () => {
    // Validação de campos
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Email inválido', 'Por favor, insira um email válido.');
      return;
    }

    setIsLoggingIn(true);
    // Força uma atualização visual
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      // Chama a função de login da API
      const result = await loginUser(email, password);
      
      if (result.success) {
        // Login bem-sucedido
        setIsAuthenticated(true);
        setUserInfo({
          name: result.user.username || 'Usuário',
          email: result.user.email,
          id: result.user.id,
        });
        setEmail('');
        setPassword('');
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
      } else {
        // Erro no login
        Alert.alert('Erro no Login', result.error || 'Não foi possível fazer o login. Tente novamente.');
      }
    } catch (error) {
      // Erro de rede ou erro inesperado
      console.error('Erro no login:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            // Remove o usuário do AsyncStorage
            await removeLoggedInUser();
            setIsAuthenticated(false);
            setEmail('');
            setPassword('');
            setUserInfo({
              name: 'Usuário de Exemplo',
              email: 'email@gmail.com',
              id: 'Cbkb134huinU32nwe3',
            });
          },
        },
      ]
    );
  };
  
  // Array que define as opções do menu de navegação
  const configOptions = [
    { name: "Contas Vinculadas", icon: "link-outline", screen: "LinkedAccounts" },
    { name: "Senha e Segurança", icon: "lock-closed-outline", screen: "SecuritySettings" },
    { name: "Pagamentos", icon: "card-outline", screen: "PaymentMethods" },
    { name: "Transações", icon: "receipt-outline", screen: "TransactionsHistory" },
    { name: "Assinaturas (PLUS+)", icon: "star-outline", screen: "SubscriptionPlans" },
  ];

  const renderOption = (item) => (
    <TouchableOpacity 
      key={item.name} 
      style={styles.optionButton} 
      onPress={() => navigation.navigate(item.screen)}
    >
      <View style={styles.optionContent}>
        <Ionicons name={item.icon} size={24} color="#003366" style={styles.optionIcon} />
        <Text style={styles.optionText}>{item.name}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={20} color="#888" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return <LoadingScreen message="Carregando configurações..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {isAuthenticated && (
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              {Platform.OS === 'web' ? (
                <Text style={styles.backText}>←</Text>
              ) : (
                <Ionicons name="arrow-back" size={24} color="#000" />
              )}
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Configurações</Text>
          </View>
        </View>
      )}

      {!isAuthenticated && (
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButtonAbsolute}
        >
          {Platform.OS === 'web' ? (
            <Text style={styles.backText}>←</Text>
          ) : (
            <Ionicons name="arrow-back" size={24} color="#000" />
          )}
        </TouchableOpacity>
      )}

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          !isAuthenticated && styles.scrollContentCentered
        ]}
      >
        
        {/* Seção de Login ou Informações do Usuário */}
        {!isAuthenticated ? (
          <View style={styles.loginContainer}>
            <LinearGradient
              colors={['#a1d5ff', '#87CEEB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.loginCard}
            >
              <Text style={styles.loginTitle}>Login</Text>
              
              <TextInput
                style={styles.loginInput}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoggingIn}
              />

              <TextInput
                style={styles.loginInput}
                placeholder="Senha"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoggingIn}
              />

              <TouchableOpacity
                style={styles.forgotPasswordLink}
                onPress={() => navigation.navigate('RecoverPassword')}
              >
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.loginButton, isLoggingIn && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <Text style={styles.loginButtonText}>Entrando...</Text>
                ) : (
                  <Text style={styles.loginButtonText}>ENTRAR</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.registerLinkText}>Não possui um cadastro? Cadastre-se</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          <View style={styles.infoCard}>
            <View style={styles.userHeader}>
              <View style={styles.userIconContainer}>
                <Ionicons name="person" size={32} color="#003366" />
              </View>
              <View style={styles.userInfoContainer}>
                <Text style={styles.userName}>{userInfo.name}</Text>
                <Text style={styles.userEmail}>{userInfo.email}</Text>
              </View>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Ionicons name="log-out-outline" size={24} color="#E74C3C" />
              </TouchableOpacity>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.infoText}>ID: {userInfo.id}</Text>
            </View>
          </View>
        )}

        {/* Menu de Configurações - Só aparece se estiver autenticado */}
        {isAuthenticated && (
          <View style={styles.menuContainer}>
            <Text style={styles.menuHeader}>Gerenciamento</Text>
            {configOptions.map(renderOption)}
          </View>
        )}

        {isAuthenticated && (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Detalhes Pessoais</Text>
            <Text style={styles.policyText}>
              Gerencie seu nome e informações de contato. Essas informações pessoais são privadas e não serão exibidas para outros usuários. Veja nossa <Text style={{textDecorationLine: 'underline'}}>Política de Privacidade</Text>.
            </Text>
          </View>
        )}

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
    paddingBottom: Platform.OS === 'web' ? 15 : 14,
    paddingHorizontal: Platform.OS === 'web' ? 15 : 16,
    backgroundColor: '#a1d5ff',
    borderBottomWidth: 0,
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
  scrollContent: {
    padding: Platform.OS === 'web' ? 20 : 0,
    paddingBottom: Platform.OS === 'web' ? 20 : 24,
    flexGrow: 1,
  },
  scrollContentCentered: {
    justifyContent: 'center',
    minHeight: Platform.OS === 'web' ? 'auto' : '100%',
    paddingTop: Platform.OS === 'web' ? 0 : 20,
  },
  backButtonAbsolute: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 15 : Platform.OS === 'ios' ? 12 : 60,
    left: Platform.OS === 'web' ? 15 : 16,
    zIndex: 1000,
    padding: Platform.OS === 'web' ? 10 : 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  // --- Login Container e Card ---
  loginContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    paddingHorizontal: Platform.OS === 'web' ? 0 : 0,
  },
  loginCard: {
    width: Platform.OS === 'web' ? '90%' : '92%',
    maxWidth: 500,
    padding: Platform.OS === 'web' ? 30 : 36,
    paddingTop: Platform.OS === 'web' ? 40 : 52,
    paddingBottom: Platform.OS === 'web' ? 40 : 52,
    borderRadius: Platform.OS === 'web' ? 20 : 28,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    minHeight: Platform.OS === 'web' ? 'auto' : 480,
  },
  loginTitle: {
    fontSize: Platform.OS === 'web' ? 32 : 26,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: Platform.OS === 'web' ? 40 : 40,
  },
  loginInput: {
    width: '100%',
    backgroundColor: '#fbf4dc',
    padding: Platform.OS === 'web' ? 18 : 18,
    borderRadius: Platform.OS === 'web' ? 12 : 18,
    marginBottom: Platform.OS === 'web' ? 20 : 20,
    fontSize: Platform.OS === 'web' ? 16 : 16,
    color: '#000',
    fontWeight: '400',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  forgotPasswordLink: {
    alignItems: 'flex-end',
    marginBottom: Platform.OS === 'web' ? 30 : 28,
    marginTop: Platform.OS === 'web' ? -10 : -8,
  },
  forgotPasswordText: {
    color: '#003366',
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#003366',
    padding: Platform.OS === 'web' ? 18 : 16,
    borderRadius: Platform.OS === 'web' ? 30 : 28,
    width: '100%',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 20 : 18,
    minHeight: Platform.OS === 'web' ? 56 : 52,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '700',
    letterSpacing: Platform.OS === 'web' ? 1.5 : 1,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 10 : 8,
  },
  registerLinkText: {
    color: '#003366',
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontWeight: '500',
  },
  // --- Info Card (Topo) ---
  infoCard: {
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 20 : 18,
    borderRadius: Platform.OS === 'web' ? 10 : 16,
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    borderLeftWidth: 5,
    borderLeftColor: '#003366',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'web' ? 15 : 12,
  },
  userIconContainer: {
    width: Platform.OS === 'web' ? 60 : 56,
    height: Platform.OS === 'web' ? 60 : 56,
    borderRadius: Platform.OS === 'web' ? 30 : 28,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Platform.OS === 'web' ? 15 : 12,
    borderWidth: 2,
    borderColor: '#003366',
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 4 : 2,
  },
  userEmail: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#666',
    fontWeight: '400',
  },
  logoutButton: {
    padding: Platform.OS === 'web' ? 8 : 6,
    borderRadius: Platform.OS === 'web' ? 20 : 18,
    backgroundColor: '#FFF5F5',
  },
  userDetails: {
    paddingTop: Platform.OS === 'web' ? 12 : 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardTitle: {
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 10 : 8,
  },
  infoText: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#555',
    lineHeight: Platform.OS === 'web' ? 20 : 19,
    fontWeight: '400',
  },
  // --- Menu de Configurações ---
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: Platform.OS === 'web' ? 10 : 16,
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuHeader: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '700',
    color: '#666',
    padding: Platform.OS === 'web' ? 15 : 14,
    backgroundColor: '#F9F9F9',
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 15 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    minHeight: 56,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#000',
    fontWeight: '400',
  },
  // --- Detalhes Pessoais Link ---
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 5,
  },
  policyText: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  }
});

export default ConfigsScreen;