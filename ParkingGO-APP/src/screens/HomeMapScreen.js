import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Image, FlatList, Modal, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';
import LoadingScreen from '../components/LoadingScreen';
import { getLoggedInUser } from '../api/auth';

let MapComponent;

if (Platform.OS === 'web') {
  const WebMap = require('../components/WebMap').default;
  MapComponent = WebMap;
} else {
  const NativeMap = require('../components/NativeMap').default;
  MapComponent = NativeMap;
} 

const estadosBrasileirosComCoordenadas = {
  'Acre': { latitude: -9.0238, longitude: -70.8111 },
  'Alagoas': { latitude: -9.5713, longitude: -36.7820 },
  'Amapá': { latitude: 1.4144, longitude: -51.7860 },
  'Amazonas': { latitude: -4.2689, longitude: -65.8569 },
  'Bahia': { latitude: -12.9714, longitude: -38.5014 },
  'Ceará': { latitude: -5.4984, longitude: -39.3206 },
  'Distrito Federal': { latitude: -15.7801, longitude: -47.9292 },
  'Espírito Santo': { latitude: -19.1834, longitude: -40.3089 },
  'Goiás': { latitude: -16.6864, longitude: -49.2643 },
  'Maranhão': { latitude: -4.9609, longitude: -45.2744 },
  'Mato Grosso': { latitude: -12.6819, longitude: -56.9211 },
  'Mato Grosso do Sul': { latitude: -20.7722, longitude: -54.7852 },
  'Minas Gerais': { latitude: -18.5122, longitude: -44.5550 },
  'Pará': { latitude: -5.5277, longitude: -52.0295 },
  'Paraíba': { latitude: -7.2400, longitude: -36.7820 },
  'Paraná': { latitude: -24.8939, longitude: -51.4254 },
  'Pernambuco': { latitude: -8.8137, longitude: -36.9541 },
  'Piauí': { latitude: -8.8137, longitude: -42.5489 },
  'Rio de Janeiro': { latitude: -22.9068, longitude: -43.1729 },
  'Rio Grande do Norte': { latitude: -5.4026, longitude: -36.9541 },
  'Rio Grande do Sul': { latitude: -30.0346, longitude: -51.2177 },
  'Rondônia': { latitude: -11.5057, longitude: -63.5806 },
  'Roraima': { latitude: 1.4144, longitude: -61.4444 },
  'Santa Catarina': { latitude: -27.2423, longitude: -50.2189 },
  'São Paulo': { latitude: -23.5505, longitude: -46.6333 },
  'Sergipe': { latitude: -10.5741, longitude: -37.3857 },
  'Tocantins': { latitude: -10.1753, longitude: -48.2982 },
};

const estadosBrasileiros = Object.keys(estadosBrasileirosComCoordenadas);

const mockParkingSpots = [
  { 
    id: 1, 
    name: "Continente Shopping", 
    latitude: -27.600, 
    longitude: -48.590, 
    status: 'CHEIO', 
    available: 12,
    totalSpots: 200,
    flowLevel: 'Alto',
    lastUpdate: '15/01/2024 14:30',
    photoUrl: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s+003366(-48.590,-27.600)/-48.590,-27.600,15,0/400x300?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`,
    basePrice: 20.00, // Preço base até 4 horas (sex-dom)
    additionalHour: 3.00, // Hora adicional
  },
  { 
    id: 2, 
    name: "Estacionamento Central", 
    latitude: -27.595, 
    longitude: -48.600, 
    status: 'LIVRE', 
    available: 50,
    totalSpots: 150,
    flowLevel: 'Baixo',
    lastUpdate: '15/01/2024 14:25',
    photoUrl: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s+003366(-48.600,-27.595)/-48.600,-27.595,15,0/400x300?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`
  },
  { 
    id: 3, 
    name: "Estacionamento Praia", 
    latitude: -27.605, 
    longitude: -48.585, 
    status: 'MODERADO', 
    available: 35,
    totalSpots: 100,
    flowLevel: 'Médio',
    lastUpdate: '15/01/2024 14:20',
    photoUrl: `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s+003366(-48.585,-27.605)/-48.585,-27.605,15,0/400x300?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`
  },
];

const HomeMapScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sugestoes, setSugestoes] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [selectedParking, setSelectedParking] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userPlan, setUserPlan] = useState('free'); // 'free', 'vip', 'mvp_plus'
  
  const [mapRegion, setMapRegion] = useState({
    latitude: -27.600,
    longitude: -48.580,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    // Simula o carregamento do mapa
    const loadMap = async () => {
      // Força uma atualização visual
      await new Promise(resolve => setTimeout(resolve, 100));
      // Simula o tempo de carregamento do mapa
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };
    loadMap();
  }, []);

  useEffect(() => {
    console.log('modalVisible mudou para:', modalVisible);
    console.log('selectedParking:', selectedParking);
  }, [modalVisible, selectedParking]);

  const handleInputChange = (text) => {
    setSearchQuery(text);
    
    if (selectedEstado && text.trim() !== selectedEstado) {
      setSelectedEstado(null);
    }
    
    if (text.trim()) {
      const filtrados = estadosBrasileiros.filter((estado) =>
        estado.toLowerCase().includes(text.toLowerCase())
      );
      setSugestoes(filtrados);
      if (!isFocused) {
        setIsFocused(true);
      }
    } else {
      setSugestoes([]);
    }
  };

  const handleSelectEstado = (estado) => {
    setSearchQuery(estado);
    setSugestoes([]);
    setIsFocused(false);
    setSelectedEstado(estado);
    
    const coordenadas = estadosBrasileirosComCoordenadas[estado];
    if (coordenadas) {
      setMapRegion({
        latitude: coordenadas.latitude,
        longitude: coordenadas.longitude,
        latitudeDelta: 5.0,
        longitudeDelta: 5.0,
      });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSugestoes([]);
    setSelectedEstado(null);
    setIsFocused(false);
    setMapRegion({
      latitude: -27.600,
      longitude: -48.580,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  const handleSearch = () => {
    console.log('Buscando por:', searchQuery);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (searchQuery.trim()) {
      const filtrados = estadosBrasileiros.filter((estado) =>
        estado.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSugestoes(filtrados);
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
    }, 200);
  };

  const handleMarkerPress = (spot) => {
    console.log('handleMarkerPress chamado com:', spot);
    try {
      setSelectedParking(spot);
      setModalVisible(true);
      console.log('Estado atualizado - modalVisible deve ser true');
      
      // Teste temporário - remover depois
      if (Platform.OS !== 'web') {
        setTimeout(() => {
          console.log('Verificando estado após 100ms - modalVisible:', modalVisible);
        }, 100);
      }
    } catch (error) {
      console.error('Erro ao abrir modal:', error);
      Alert.alert('Erro', 'Não foi possível abrir as informações do estacionamento');
    }
  };

  const getFlowLevelColor = (flowLevel) => {
    switch (flowLevel) {
      case 'Baixo':
        return '#2ECC71';
      case 'Médio':
        return '#F39C12';
      case 'Alto':
        return '#E74C3C';
      default:
        return '#666';
    }
  };

  const getFlowLevelIcon = (flowLevel) => {
    switch (flowLevel) {
      case 'Baixo':
        return 'checkmark-circle';
      case 'Médio':
        return 'warning';
      case 'Alto':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const calculatePrice = (basePrice, plan) => {
    let discount = 0;
    switch (plan) {
      case 'vip':
        discount = 0.05; // 5% de desconto
        break;
      case 'mvp_plus':
        discount = 0.10; // 10% de desconto
        break;
      default:
        discount = 0; // FREE sem desconto
    }
    const finalPrice = basePrice * (1 - discount);
    return {
      original: basePrice,
      discount: discount * 100,
      final: finalPrice,
      saved: basePrice - finalPrice
    };
  };

  useEffect(() => {
    // Carrega o plano do usuário do AsyncStorage
    const loadUserPlan = async () => {
      try {
        const user = await getLoggedInUser();
        // Por enquanto, vamos simular um plano VIP para usuários logados
        // Em produção, isso viria do backend ou AsyncStorage com o plano real
        setUserPlan(user ? 'vip' : 'free');
      } catch (error) {
        console.log('Erro ao carregar plano do usuário:', error);
        setUserPlan('free');
      }
    };
    loadUserPlan();
  }, []);

  if (isLoading) {
    return <LoadingScreen message="Carregando mapa..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            {Platform.OS === 'web' ? (
              <Text style={styles.backText}>←</Text>
            ) : (
              <Ionicons name="arrow-back" size={24} color="#000" style={styles.backIcon} />
            )}
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Onde vamos reservar?</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            {Platform.OS === 'web' ? (
              <Text style={styles.searchIcon}>🔍</Text>
            ) : (
              <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
            )}
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar estado, cidade ou bairro"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={handleInputChange}
              onSubmitEditing={handleSearch}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
                {Platform.OS === 'web' ? (
                  <Text style={styles.clearText}>✕</Text>
                ) : (
                  <Ionicons name="close-circle" size={20} color="#888" />
                )}
              </TouchableOpacity>
            )}
          </View>
          {sugestoes.length > 0 && isFocused && (
            <View style={[styles.suggestionsContainer, Platform.OS === 'web' && styles.suggestionsContainerWeb]}>
              <FlatList
                data={sugestoes}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelectEstado(item)}
                  >
                    <Text style={styles.suggestionText}>{ item }</Text>
                  </TouchableOpacity>
                )}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              />
            </View>
          )}
        </View>
        <Text style={styles.searchHint}>Selecione estado, cidade ou bairro</Text>
      </View>

      <View style={styles.mapWrapper}>
        <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <MapComponent
            style={styles.map}
            initialRegion={mapRegion}
            region={mapRegion}
            markers={mockParkingSpots.map(spot => ({
              id: spot.id,
              latitude: spot.latitude,
              longitude: spot.longitude,
              title: spot.name,
              description: `Vagas: ${spot.available}`,
              onPress: () => handleMarkerPress(spot)
            }))}
            selectedEstado={selectedEstado ? {
              nome: selectedEstado,
              ...estadosBrasileirosComCoordenadas[selectedEstado]
            } : null}
          />
        ) : (
          <MapComponent
            style={styles.map}
            initialRegion={mapRegion}
            region={mapRegion}
            showsUserLocation={true}
          >
            {selectedEstado && estadosBrasileirosComCoordenadas[selectedEstado] && (
              <>
                {MapComponent.Circle && (
                  <MapComponent.Circle
                    center={{
                      latitude: estadosBrasileirosComCoordenadas[selectedEstado].latitude,
                      longitude: estadosBrasileirosComCoordenadas[selectedEstado].longitude,
                    }}
                    radius={150000}
                    strokeWidth={3}
                    strokeColor="#003366"
                    fillColor="#003366"
                    fillOpacity={0.2}
                  />
                )}
                <MapComponent.Marker
                  coordinate={{
                    latitude: estadosBrasileirosComCoordenadas[selectedEstado].latitude,
                    longitude: estadosBrasileirosComCoordenadas[selectedEstado].longitude,
                  }}
                  title={selectedEstado}
                  pinColor="#003366"
                />
              </>
            )}
            {mockParkingSpots.map(spot => (
              <MapComponent.Marker
                key={spot.id}
                coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                title={spot.name}
                description={`Vagas: ${spot.available}`}
                onPress={(e) => {
                  if (e && e.stopPropagation) {
                    e.stopPropagation();
                  }
                  console.log('Marker onPress - spot:', spot);
                  handleMarkerPress(spot);
                }}
                onSelect={(e) => {
                  console.log('Marker onSelect - spot:', spot);
                  handleMarkerPress(spot);
                }}
                tracksViewChanges={false}
                pinColor="#003366"
              />
            ))}
          </MapComponent>
        )}
        </View>
      </View>

      {Platform.OS === 'web' ? (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {
            console.log('Modal fechado via onRequestClose');
            setModalVisible(false);
          }}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalOverlayTouchable}
              activeOpacity={1}
              onPress={() => {
                console.log('Overlay pressionado, fechando modal');
                setModalVisible(false);
              }}
            />
            <View style={styles.modalContent}>
              {selectedParking ? (
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContentStyle}
                >
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => {
                      console.log('Botão fechar pressionado');
                      setModalVisible(false);
                    }}
                  >
                    <Ionicons name="close-circle" size={32} color="#666" />
                  </TouchableOpacity>

                <View style={styles.parkingImageContainer}>
                  <Image
                    source={{ 
                      uri: selectedParking.photoUrl || 'https://via.placeholder.com/400x300/003366/FFFFFF?text=Estacionamento'
                    }}
                    style={styles.parkingImage}
                    resizeMode="cover"
                    onError={() => {
                      console.log('Erro ao carregar imagem');
                    }}
                  />
                </View>

                <View style={styles.parkingInfoContainer}>
                  <Text style={styles.parkingName}>{selectedParking.name}</Text>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons name="car-outline" size={24} color="#003366" />
                      <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Total de Vagas</Text>
                        <Text style={styles.infoValue}>{selectedParking.totalSpots}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons name="car" size={24} color="#003366" />
                      <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Vagas Disponíveis</Text>
                        <Text style={[styles.infoValue, { color: selectedParking.available > 0 ? '#2ECC71' : '#E74C3C' }]}>
                          {selectedParking.available}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons 
                        name={getFlowLevelIcon(selectedParking.flowLevel)} 
                        size={24} 
                        color={getFlowLevelColor(selectedParking.flowLevel)} 
                      />
                      <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Nível de Fluxo</Text>
                        <View style={styles.flowLevelContainer}>
                          <View style={[
                            styles.flowLevelBadge,
                            { backgroundColor: getFlowLevelColor(selectedParking.flowLevel) + '20' }
                          ]}>
                            <Text style={[
                              styles.flowLevelText,
                              { color: getFlowLevelColor(selectedParking.flowLevel) }
                            ]}>
                              {selectedParking.flowLevel}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <Ionicons name="time-outline" size={24} color="#003366" />
                      <View style={styles.infoTextContainer}>
                        <Text style={styles.infoLabel}>Última Atualização</Text>
                        <Text style={styles.infoValue}>{selectedParking.lastUpdate}</Text>
                      </View>
                    </View>
                  </View>

                  {selectedParking.basePrice && (
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceTitle}>Preço (até 4 horas)</Text>
                      {(() => {
                        const priceInfo = calculatePrice(selectedParking.basePrice, userPlan);
                        return (
                          <View style={styles.priceDetails}>
                            {userPlan !== 'free' && (
                              <View style={styles.originalPriceContainer}>
                                <Text style={styles.originalPriceLabel}>Preço Original:</Text>
                                <Text style={styles.originalPrice}>R$ {priceInfo.original.toFixed(2)}</Text>
                              </View>
                            )}
                            <View style={styles.finalPriceContainer}>
                              <Text style={styles.finalPriceLabel}>
                                {userPlan !== 'free' ? 'Preço com Desconto:' : 'Preço:'}
                              </Text>
                              <Text style={styles.finalPrice}>R$ {priceInfo.final.toFixed(2)}</Text>
                            </View>
                            {userPlan !== 'free' && (
                              <View style={styles.discountBadge}>
                                <Ionicons name="pricetag" size={16} color="#2ECC71" />
                                <Text style={styles.discountText}>
                                  {priceInfo.discount}% OFF - Economize R$ {priceInfo.saved.toFixed(2)}
                                </Text>
                              </View>
                            )}
                            <View style={styles.additionalInfo}>
                              <Text style={styles.additionalInfoText}>
                                Hora adicional: R$ {selectedParking.additionalHour?.toFixed(2) || '3,00'}
                              </Text>
                            </View>
                            <View style={styles.planInfo}>
                              <Ionicons name="star" size={16} color="#F39C12" />
                              <Text style={styles.planInfoText}>
                                Plano atual: {userPlan === 'free' ? 'FREE' : userPlan === 'vip' ? 'VIP' : 'MVP+'}
                              </Text>
                            </View>
                          </View>
                        );
                      })()}
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.reserveButton}
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate('Reservation', { parking: selectedParking });
                    }}
                  >
                    <Text style={styles.reserveButtonText}>Reservar Vaga</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <View style={styles.modalLoadingContainer}>
                <Text style={styles.modalLoadingText}>Carregando informações...</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
      ) : (
        // Overlay customizado para mobile
        modalVisible && (
          <View style={styles.customModalOverlay}>
            <TouchableOpacity 
              style={styles.customModalBackdrop}
              activeOpacity={1}
              onPress={() => setModalVisible(false)}
            />
            <View style={styles.customModalContent}>
              {selectedParking ? (
                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContentStyle}
                >
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close-circle" size={32} color="#666" />
                  </TouchableOpacity>

                  <View style={styles.parkingImageContainer}>
                    <Image
                      source={{ 
                        uri: selectedParking.photoUrl || 'https://via.placeholder.com/400x300/003366/FFFFFF?text=Estacionamento'
                      }}
                      style={styles.parkingImage}
                      resizeMode="cover"
                      onError={() => {
                        console.log('Erro ao carregar imagem');
                      }}
                    />
                  </View>

                  <View style={styles.parkingInfoContainer}>
                    <Text style={styles.parkingName}>{selectedParking.name}</Text>

                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Ionicons name="car-outline" size={24} color="#003366" />
                        <View style={styles.infoTextContainer}>
                          <Text style={styles.infoLabel}>Total de Vagas</Text>
                          <Text style={styles.infoValue}>{selectedParking.totalSpots}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Ionicons name="car" size={24} color="#003366" />
                        <View style={styles.infoTextContainer}>
                          <Text style={styles.infoLabel}>Vagas Disponíveis</Text>
                          <Text style={[styles.infoValue, { color: selectedParking.available > 0 ? '#2ECC71' : '#E74C3C' }]}>
                            {selectedParking.available}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Ionicons 
                          name={getFlowLevelIcon(selectedParking.flowLevel)} 
                          size={24} 
                          color={getFlowLevelColor(selectedParking.flowLevel)} 
                        />
                        <View style={styles.infoTextContainer}>
                          <Text style={styles.infoLabel}>Nível de Fluxo</Text>
                          <View style={styles.flowLevelContainer}>
                            <View style={[
                              styles.flowLevelBadge,
                              { backgroundColor: getFlowLevelColor(selectedParking.flowLevel) + '20' }
                            ]}>
                              <Text style={[
                                styles.flowLevelText,
                                { color: getFlowLevelColor(selectedParking.flowLevel) }
                              ]}>
                                {selectedParking.flowLevel}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Ionicons name="time-outline" size={24} color="#003366" />
                        <View style={styles.infoTextContainer}>
                          <Text style={styles.infoLabel}>Última Atualização</Text>
                          <Text style={styles.infoValue}>{selectedParking.lastUpdate}</Text>
                        </View>
                      </View>
                    </View>

                    {selectedParking.basePrice && (
                      <View style={styles.priceContainer}>
                        <Text style={styles.priceTitle}>Preço (até 4 horas)</Text>
                        {(() => {
                          const priceInfo = calculatePrice(selectedParking.basePrice, userPlan);
                          return (
                            <View style={styles.priceDetails}>
                              {userPlan !== 'free' && (
                                <View style={styles.originalPriceContainer}>
                                  <Text style={styles.originalPriceLabel}>Preço Original:</Text>
                                  <Text style={styles.originalPrice}>R$ {priceInfo.original.toFixed(2)}</Text>
                                </View>
                              )}
                              <View style={styles.finalPriceContainer}>
                                <Text style={styles.finalPriceLabel}>
                                  {userPlan !== 'free' ? 'Preço com Desconto:' : 'Preço:'}
                                </Text>
                                <Text style={styles.finalPrice}>R$ {priceInfo.final.toFixed(2)}</Text>
                              </View>
                              {userPlan !== 'free' && (
                                <View style={styles.discountBadge}>
                                  <Ionicons name="pricetag" size={16} color="#2ECC71" />
                                  <Text style={styles.discountText}>
                                    {priceInfo.discount}% OFF - Economize R$ {priceInfo.saved.toFixed(2)}
                                  </Text>
                                </View>
                              )}
                              <View style={styles.additionalInfo}>
                                <Text style={styles.additionalInfoText}>
                                  Hora adicional: R$ {selectedParking.additionalHour?.toFixed(2) || '3,00'}
                                </Text>
                              </View>
                              <View style={styles.planInfo}>
                                <Ionicons name="star" size={16} color="#F39C12" />
                                <Text style={styles.planInfoText}>
                                  Plano atual: {userPlan === 'free' ? 'FREE' : userPlan === 'vip' ? 'VIP' : 'MVP+'}
                                </Text>
                              </View>
                            </View>
                          );
                        })()}
                      </View>
                    )}

                    <TouchableOpacity
                      style={styles.reserveButton}
                      onPress={() => {
                        setModalVisible(false);
                        navigation.navigate('Reservation', { parking: selectedParking });
                      }}
                    >
                      <Text style={styles.reserveButtonText}>Reservar Vaga</Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              ) : (
                <View style={styles.modalLoadingContainer}>
                  <Text style={styles.modalLoadingText}>Carregando informações...</Text>
                </View>
              )}
            </View>
          </View>
        )
      )}

      <BottomNavigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbf4dc',
    ...(Platform.OS === 'web' && {
      position: 'relative',
    }),
  },
  header: {
    backgroundColor: '#a1d5ff',
    paddingTop: Platform.OS === 'web' ? 40 : Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: Platform.OS === 'web' ? 20 : 16,
    paddingHorizontal: Platform.OS === 'web' ? 20 : 16,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    zIndex: Platform.OS === 'web' ? 1000 : 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'web' ? 20 : 16,
    position: 'relative',
    paddingTop: Platform.OS === 'web' ? 0 : Platform.OS === 'ios' ? 12 : 50,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    zIndex: 10,
    padding: Platform.OS === 'web' ? 10 : 8,
    paddingTop: Platform.OS === 'web' ? 10 : Platform.OS === 'ios' ? 12 : 60,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
  },
  backText: {
    fontSize: Platform.OS === 'web' ? 24 : 22,
    color: '#000',
    fontWeight: 'bold',
  },
  backIcon: {
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: 50,
  },
  searchContainer: {
    width: Platform.OS === 'web' ? '90%' : '100%',
    maxWidth: 600,
    position: 'relative',
    zIndex: Platform.OS === 'web' ? 1001 : 1000,
    paddingHorizontal: Platform.OS === 'web' ? 0 : 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    paddingHorizontal: Platform.OS === 'web' ? 15 : 16,
    width: '100%',
    height: Platform.OS === 'web' ? 50 : 52,
    marginBottom: Platform.OS === 'web' ? 8 : 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: Platform.OS === 'web' ? 10 : 12,
    fontSize: Platform.OS === 'web' ? 20 : 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Platform.OS === 'web' ? 12 : 14,
    fontSize: Platform.OS === 'web' ? 16 : 16,
    color: '#000',
    paddingRight: 8,
  },
  clearButton: {
    padding: Platform.OS === 'web' ? 5 : 8,
    marginLeft: Platform.OS === 'web' ? 5 : 4,
    minWidth: 32,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearText: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#888',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 58 : 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: Platform.OS === 'web' ? 10 : 12,
    maxHeight: Platform.OS === 'web' ? 200 : 250,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
    zIndex: Platform.OS === 'web' ? 1002 : 1001,
  },
  suggestionsContainerWeb: {
    zIndex: 9999,
    position: 'absolute',
  },
  suggestionItem: {
    paddingHorizontal: Platform.OS === 'web' ? 15 : 16,
    paddingVertical: Platform.OS === 'web' ? 12 : 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    minHeight: 48,
    justifyContent: 'center',
  },
  suggestionText: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#000',
    fontWeight: '400',
  },
  searchHint: {
    fontSize: Platform.OS === 'web' ? 12 : 11,
    color: '#666',
    marginTop: Platform.OS === 'web' ? 5 : 4,
    marginLeft: Platform.OS === 'web' ? 20 : 16,
    marginBottom: Platform.OS === 'web' ? 10 : 8,
    fontWeight: '400',
  },
  mapWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 20 : 12,
    paddingBottom: Platform.OS === 'web' ? 20 : 16,
    paddingHorizontal: Platform.OS === 'web' ? 0 : 4,
    zIndex: Platform.OS === 'web' ? 1 : 0,
  },
  mapContainer: {
    width: Platform.OS === 'web' ? '90%' : '100%',
    maxWidth: 600,
    height: Platform.OS === 'web' ? 600 : '100%',
    borderRadius: Platform.OS === 'web' ? 15 : 16,
    overflow: 'hidden',
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#e0e0e0',
    zIndex: Platform.OS === 'web' ? 1 : 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  },
  modalOverlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  modalContent: {
    backgroundColor: '#fbf4dc',
    borderTopLeftRadius: Platform.OS === 'web' ? 20 : 24,
    borderTopRightRadius: Platform.OS === 'web' ? 20 : 24,
    maxHeight: Platform.OS === 'web' ? '90%' : Platform.OS === 'ios' ? '85%' : '90%',
    paddingBottom: Platform.OS === 'web' ? 20 : Platform.OS === 'ios' ? 40 : 60,
    width: '100%',
    position: 'relative',
    zIndex: 10000,
    elevation: 10000,
  },
  modalScrollView: {
    flex: 1,
  },
  scrollContentStyle: {
    paddingBottom: Platform.OS === 'web' ? 20 : 20,
  },
  modalLoadingContainer: {
    padding: Platform.OS === 'web' ? 40 : 30,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Platform.OS === 'web' ? 200 : 150,
  },
  modalLoadingText: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#666',
  },
  modalCloseButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 15 : 12,
    right: Platform.OS === 'web' ? 15 : 12,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
  },
  parkingImageContainer: {
    width: '100%',
    height: Platform.OS === 'web' ? 250 : 200,
    backgroundColor: '#e0e0e0',
  },
  parkingImage: {
    width: '100%',
    height: '100%',
  },
  parkingInfoContainer: {
    padding: Platform.OS === 'web' ? 20 : 18,
  },
  parkingName: {
    fontSize: Platform.OS === 'web' ? 24 : 22,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 20 : 18,
    textAlign: 'center',
  },
  infoRow: {
    marginBottom: Platform.OS === 'web' ? 18 : 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 16 : 14,
    borderRadius: Platform.OS === 'web' ? 12 : 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTextContainer: {
    marginLeft: Platform.OS === 'web' ? 15 : 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#666',
    marginBottom: Platform.OS === 'web' ? 4 : 2,
  },
  infoValue: {
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    color: '#000',
  },
  flowLevelContainer: {
    marginTop: Platform.OS === 'web' ? 4 : 2,
  },
  flowLevelBadge: {
    paddingHorizontal: Platform.OS === 'web' ? 12 : 10,
    paddingVertical: Platform.OS === 'web' ? 6 : 4,
    borderRadius: Platform.OS === 'web' ? 8 : 6,
    alignSelf: 'flex-start',
  },
  flowLevelText: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    fontWeight: '700',
  },
  reserveButton: {
    backgroundColor: '#003366',
    padding: Platform.OS === 'web' ? 18 : 16,
    borderRadius: Platform.OS === 'web' ? 12 : 14,
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 20 : 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  reserveButtonText: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    letterSpacing: Platform.OS === 'web' ? 1 : 0.5,
  },
  priceContainer: {
    backgroundColor: '#FFF',
    padding: Platform.OS === 'web' ? 18 : 16,
    borderRadius: Platform.OS === 'web' ? 12 : 14,
    marginTop: Platform.OS === 'web' ? 10 : 8,
    marginBottom: Platform.OS === 'web' ? 10 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceTitle: {
    fontSize: Platform.OS === 'web' ? 18 : 17,
    fontWeight: '700',
    color: '#003366',
    marginBottom: Platform.OS === 'web' ? 12 : 10,
  },
  priceDetails: {
    gap: Platform.OS === 'web' ? 10 : 8,
  },
  originalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'web' ? 8 : 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  originalPriceLabel: {
    fontSize: Platform.OS === 'web' ? 14 : 13,
    color: '#666',
  },
  originalPrice: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    color: '#999',
    textDecorationLine: 'line-through',
  },
  finalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'web' ? 8 : 6,
  },
  finalPriceLabel: {
    fontSize: Platform.OS === 'web' ? 16 : 15,
    fontWeight: '600',
    color: '#000',
  },
  finalPrice: {
    fontSize: Platform.OS === 'web' ? 22 : 20,
    fontWeight: '700',
    color: '#2ECC71',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: Platform.OS === 'web' ? 10 : 8,
    borderRadius: Platform.OS === 'web' ? 8 : 6,
    borderWidth: 1,
    borderColor: '#2ECC71',
    marginTop: Platform.OS === 'web' ? 6 : 4,
  },
  discountText: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#2ECC71',
    fontWeight: '600',
    marginLeft: Platform.OS === 'web' ? 6 : 4,
  },
  additionalInfo: {
    marginTop: Platform.OS === 'web' ? 8 : 6,
    paddingTop: Platform.OS === 'web' ? 8 : 6,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  additionalInfoText: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#666',
    fontStyle: 'italic',
  },
  planInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Platform.OS === 'web' ? 8 : 6,
    paddingTop: Platform.OS === 'web' ? 8 : 6,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  planInfoText: {
    fontSize: Platform.OS === 'web' ? 13 : 12,
    color: '#F39C12',
    fontWeight: '600',
    marginLeft: Platform.OS === 'web' ? 6 : 4,
  },
  testButton: {
    backgroundColor: '#E74C3C',
    padding: Platform.OS === 'web' ? 10 : 8,
    borderRadius: Platform.OS === 'web' ? 8 : 6,
    marginHorizontal: Platform.OS === 'web' ? 20 : 16,
    marginTop: Platform.OS === 'web' ? 10 : 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#FFF',
    fontSize: Platform.OS === 'web' ? 14 : 12,
    fontWeight: '600',
  },
  customModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 10000,
    elevation: 10000,
  },
  customModalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height: '100%',
  },
  customModalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fbf4dc',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 60,
    width: '100%',
    zIndex: 10001,
    elevation: 10001,
  },
});

export default HomeMapScreen;