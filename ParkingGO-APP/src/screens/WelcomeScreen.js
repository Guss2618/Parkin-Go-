import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Image, Animated, Easing } from 'react-native';
import LinearGradient from '../components/LinearGradient';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';

let Icon;
if (Platform.OS === 'web') {
  Icon = ({ name, size, color, style }) => {
    const iconMap = {
      'home': '🏠',
      'card': '💳',
      'person': '👤',
      'add': '+',
      'search': '🔍',
    };
    return <span style={{ fontSize: size, color, ...style }}>{iconMap[name] || '•'}</span>;
  };
} else {
  Icon = require('react-native-vector-icons/Ionicons').default;
}

const WelcomeScreen = ({ navigation }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -15,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, [translateY]);

  const handleSearch = async () => {
    setIsLoading(true);
    // Força uma atualização visual antes de navegar
    await new Promise(resolve => setTimeout(resolve, 100));
    // Simula um delay para carregar a tela do mapa
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    navigation.navigate('HomeMap');
  };

  if (isLoading) {
    return <LoadingScreen message="Carregando mapa..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { alignItems: 'stretch' }]}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/images/Parking Go!.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.mainHeading}>
          Encontre sua vaga ideal com facilidade.
        </Text>
        
        <Text style={styles.subHeading}>
          Estacione com praticidade, segurança e tecnologia.
        </Text>

        <View style={styles.illustrationContainer}>
          <Animated.Image 
            source={require('../../assets/images/Estacionamento.png')} 
            style={[
              styles.estacionamentoImage,
              {
                transform: [{ translateY: translateY }],
              },
            ]}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity onPress={handleSearch} activeOpacity={0.8} style={styles.searchButtonContainer}>
          <LinearGradient
            colors={['#6bb5e8', '#a8eafd']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.searchButton}
          >
            <Text style={styles.searchButtonText}>BUSCAR</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>


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
    backgroundColor: '#a1d5ff',
    paddingTop: Platform.OS === 'web' ? 20 : Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: Platform.OS === 'web' ? 15 : 12,
    paddingHorizontal: Platform.OS === 'web' ? 0 : 16,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoImage: {
    width: Platform.OS === 'web' ? 300 : Platform.OS === 'ios' ? 240 : 240,
    height: Platform.OS === 'web' ? 150 : Platform.OS === 'ios' ? 75 : 70,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 30 : 24,
    paddingTop: Platform.OS === 'web' ? 0 : 20,
  },
  mainHeading: {
    fontSize: Platform.OS === 'web' ? 28 : 24,
    fontWeight: '700',
    color: '#003366',
    textAlign: 'center',
    marginBottom: Platform.OS === 'web' ? 15 : 12,
    lineHeight: Platform.OS === 'web' ? 34 : 30,
    paddingHorizontal: Platform.OS === 'web' ? 0 : 8,
  },
  subHeading: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#003366',
    textAlign: 'center',
    marginBottom: Platform.OS === 'web' ? 20 : 24,
    lineHeight: Platform.OS === 'web' ? 22 : 21,
    paddingHorizontal: Platform.OS === 'web' ? 0 : 12,
    fontWeight: '400',
  },
  illustrationContainer: {
    width: '100%',
    height: Platform.OS === 'web' ? 300 : 240,
    marginTop: Platform.OS === 'web' ? 20 : 16,
    marginBottom: Platform.OS === 'web' ? 20 : 24,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  estacionamentoImage: {
    width: '90%',
    height: '100%',
    maxWidth: 400,
    maxHeight: Platform.OS === 'web' ? 300 : 240,
  },
  parkingLot: {
    width: 280,
    height: 140,
    backgroundColor: '#4A4A4A',
    borderRadius: 8,
    position: 'relative',
    marginTop: 20,
  },
  parkingLines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-around',
    paddingVertical: 15,
  },
  parkingLine: {
    height: 2,
    backgroundColor: '#FFF',
    marginHorizontal: 15,
  },
  car: {
    width: 55,
    height: 35,
    borderRadius: 4,
    position: 'absolute',
    borderWidth: 1,
    borderColor: '#333',
  },
  carWhite: {
    backgroundColor: '#FFF',
  },
  carRed: {
    backgroundColor: '#FF4444',
  },
  carYellow: {
    backgroundColor: '#FFD700',
  },
  parkingSign: {
    position: 'absolute',
    right: 20,
    top: 10,
    width: 45,
    height: 45,
    backgroundColor: '#4169E1',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  signP: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  tree: {
    position: 'absolute',
    width: 25,
    height: 35,
    backgroundColor: '#228B22',
    borderRadius: 12,
    bottom: 10,
  },
  searchButtonContainer: {
    width: Platform.OS === 'web' ? '90%' : '100%',
    maxWidth: 400,
    borderRadius: Platform.OS === 'web' ? 50 : 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    overflow: 'hidden',
  },
  searchButton: {
    paddingVertical: Platform.OS === 'web' ? 18 : 16,
    paddingHorizontal: Platform.OS === 'web' ? 60 : 40,
    borderRadius: Platform.OS === 'web' ? 50 : 28,
    width: '100%',
    minHeight: Platform.OS === 'web' ? 56 : 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#000',
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '700',
    letterSpacing: Platform.OS === 'web' ? 1 : 0.5,
  },
});

export default WelcomeScreen;

