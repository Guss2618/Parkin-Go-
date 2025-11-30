import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';

const SecuritySettingsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const loadSettings = async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      await new Promise(resolve => setTimeout(resolve, 700));
      setIsLoading(false);
    };
    loadSettings();
  }, []);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 8 caracteres.');
      return;
    }

    Alert.alert('Sucesso', 'Senha alterada com sucesso!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (isLoading) {
    return <LoadingScreen message="Carregando configurações..." />;
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
          <Text style={styles.headerTitle}>Senha e Segurança</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alterar Senha</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha Atual</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha atual"
              placeholderTextColor="#999"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nova Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua nova senha"
              placeholderTextColor="#999"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Nova Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirme sua nova senha"
              placeholderTextColor="#999"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
            <Text style={styles.saveButtonText}>Salvar Nova Senha</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Segurança Adicional</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#003366" style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Autenticação em Duas Etapas</Text>
                <Text style={styles.settingDescription}>Adicione uma camada extra de segurança à sua conta</Text>
              </View>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: '#ccc', true: '#003366' }}
              thumbColor={twoFactorEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="finger-print-outline" size={24} color="#003366" style={styles.settingIcon} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Biometria</Text>
                <Text style={styles.settingDescription}>Use impressão digital ou reconhecimento facial para login</Text>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ false: '#ccc', true: '#003366' }}
              thumbColor={biometricEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dispositivos Conectados</Text>
          <View style={styles.deviceCard}>
            <Ionicons name="phone-portrait-outline" size={24} color="#003366" />
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>iPhone 13 Pro</Text>
              <Text style={styles.deviceDetails}>Conectado há 2 dias • iOS 17.0</Text>
            </View>
            <TouchableOpacity>
              <Ionicons name="close-circle-outline" size={24} color="#E74C3C" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomNavigation />
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
    paddingBottom: Platform.OS === 'web' ? 15 : 14,
    paddingHorizontal: Platform.OS === 'web' ? 15 : 16,
    backgroundColor: '#a1d5ff',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Platform.OS === 'web' ? 20 : 16,
    paddingBottom: Platform.OS === 'web' ? 20 : 24,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: Platform.OS === 'web' ? 10 : 16,
    padding: Platform.OS === 'web' ? 20 : 18,
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 20 : 16,
  },
  inputContainer: {
    marginBottom: Platform.OS === 'web' ? 18 : 16,
  },
  label: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: Platform.OS === 'web' ? 8 : 6,
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: Platform.OS === 'web' ? 16 : 14,
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: Platform.OS === 'web' ? 15 : 14,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#003366',
    padding: Platform.OS === 'web' ? 16 : 14,
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 10 : 8,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '700',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Platform.OS === 'web' ? 16 : 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: Platform.OS === 'web' ? 12 : 10,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '600',
    color: '#000',
    marginBottom: Platform.OS === 'web' ? 4 : 2,
  },
  settingDescription: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#666',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Platform.OS === 'web' ? 16 : 14,
    backgroundColor: '#f9f9f9',
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    marginTop: Platform.OS === 'web' ? 10 : 8,
  },
  deviceInfo: {
    flex: 1,
    marginLeft: Platform.OS === 'web' ? 12 : 10,
  },
  deviceName: {
    fontSize: Platform.OS === 'web' ? 15 : 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: Platform.OS === 'web' ? 4 : 2,
  },
  deviceDetails: {
    fontSize: Platform.OS === 'web' ? 12 : 11,
    color: '#666',
  },
});

export default SecuritySettingsScreen;

