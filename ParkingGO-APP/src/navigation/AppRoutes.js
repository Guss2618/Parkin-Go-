// Arquivo: src/navigation/AppRouter.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform } from 'react-native';

// ----------------------------------------------------
// IMPORTAÇÃO DE TELAS (Ajuste estes caminhos se necessário)
// ----------------------------------------------------
// Telas de Autenticação e Configuração
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RecoverPasswordEmailScreen from '../screens/RecoverPasswordEmailScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen'; 
import ConfigsScreen from '../screens/ConfigsScreen';
import SubscriptionPlansScreen from '../screens/SubscriptionPlansScreen';
import LinkedAccountsScreen from '../screens/LinkedAccountsScreen';
import SecuritySettingsScreen from '../screens/SecuritySettingsScreen';
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import TransactionsHistoryScreen from '../screens/TransactionsHistoryScreen';

// Tela Inicial
import WelcomeScreen from '../screens/WelcomeScreen';

// Telas de Fluxo Principal (Busca e Reserva)
import HomeMapScreen from '../screens/HomeMapScreen';
import ReservationScreen from '../screens/ReservationScreen';
import ProcessingScreen from '../screens/ProcessingScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';

// Telas de Navegação
import CardScreen from '../screens/CardScreen';


const Stack = createNativeStackNavigator();

function AppRouter() {
  // Simulação de Autenticação. Mantenha 'false' até implementar a API.
  const isAuthenticated = false; 

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: Platform.OS === 'web' ? 'default' : 'none',
        }} 
        initialRouteName="Welcome"
      >
        
        {/* ======================================================== */}
        {/* 🏠 TELA INICIAL */}
        {/* ======================================================== */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        
        {/* ======================================================== */}
        {/* 🔐 FLUXO DE AUTENTICAÇÃO */}
        {/* ======================================================== */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RecoverPassword" component={RecoverPasswordEmailScreen} />
        <Stack.Screen name="VerifyCode" component={ResetPasswordScreen} />
        
        
        {/* ======================================================== */}
        {/* 🗺️ FLUXO PRINCIPAL E CONFIGURAÇÕES */}
        {/* ======================================================== */}
        <Stack.Screen name="HomeMap" component={HomeMapScreen} />  
        
        {/* Fluxo de Reserva */}
        <Stack.Screen name="Reservation" component={ReservationScreen} />
        {/* O 'ProcessingScreen' usa 'replace', não permitindo voltar facilmente */}
        <Stack.Screen name="ProcessingScreen" component={ProcessingScreen} /> 
        <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} /> 
        
        {/* Fluxo de Configurações */}
        <Stack.Screen name="Configs" component={ConfigsScreen} />              
        <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />
        <Stack.Screen name="LinkedAccounts" component={LinkedAccountsScreen} />
        <Stack.Screen name="SecuritySettings" component={SecuritySettingsScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="TransactionsHistory" component={TransactionsHistoryScreen} />
        
        {/* Telas de Navegação */}
        <Stack.Screen name="Card" component={CardScreen} /> 

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppRouter;