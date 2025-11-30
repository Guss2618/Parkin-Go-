import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BottomNavigation = () => {
  const navigation = useNavigation();

  const navItems = [
    {
      name: 'Home',
      label: 'Home',
      screen: 'Welcome',
      icon: require('../../assets/images/Home.png'),
      loadingMessage: 'Carregando Home...',
    },
    {
      name: 'Card',
      label: 'Card',
      screen: 'Card',
      icon: require('../../assets/images/Cartão.png'),
      loadingMessage: 'Carregando cartões...',
    },
    {
      name: 'Profile',
      label: 'Profile',
      screen: 'Configs',
      icon: require('../../assets/images/Perfil.png'),
      loadingMessage: 'Carregando perfil...',
    },
    {
      name: 'Planos',
      label: 'Planos',
      screen: 'SubscriptionPlans',
      icon: null,
      isPlus: true,
      loadingMessage: 'Carregando planos...',
    },
  ];

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={styles.navButton}
          onPress={() => navigation.navigate(item.screen)}
          activeOpacity={0.7}
        >
          <View style={styles.navButtonContent}>
            <View style={styles.navIconContainer}>
              {item.isPlus ? (
                <Text style={styles.plusText}>+</Text>
              ) : (
                <Image
                  source={item.icon}
                  style={styles.navIcon}
                  resizeMode="contain"
                />
              )}
            </View>
            <Text style={styles.navText}>{item.label}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#a1d5ff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 12 : 10,
    paddingBottom: Platform.OS === 'web' ? 12 : Platform.OS === 'ios' ? 20 : 16,
    paddingHorizontal: Platform.OS === 'web' ? 10 : 4,
    borderTopWidth: 1,
    borderTopColor: '#87CEEB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: Platform.OS === 'web' ? 8 : 6,
    paddingHorizontal: Platform.OS === 'web' ? 4 : 2,
    minHeight: Platform.OS === 'web' ? 70 : 68,
  },
  navButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  navIconContainer: {
    width: Platform.OS === 'web' ? 48 : 44,
    height: Platform.OS === 'web' ? 48 : 44,
    borderRadius: Platform.OS === 'web' ? 24 : 22,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'web' ? 6 : 5,
    borderWidth: 1.5,
    borderColor: '#e0e8f0',
    shadowColor: '#003366',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  navIcon: {
    width: Platform.OS === 'web' ? 26 : 24,
    height: Platform.OS === 'web' ? 26 : 24,
  },
  navText: {
    fontSize: Platform.OS === 'web' ? 12 : 11,
    color: '#003366',
    fontWeight: '600',
    marginTop: 0,
    letterSpacing: 0.2,
  },
  plusText: {
    fontSize: Platform.OS === 'web' ? 28 : 26,
    color: '#003366',
    fontWeight: '600',
    lineHeight: Platform.OS === 'web' ? 28 : 26,
  },
});

export default BottomNavigation;

