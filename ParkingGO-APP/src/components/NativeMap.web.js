import React from 'react';
import { View, Text } from 'react-native';

const NativeMap = ({ children, initialRegion, style, showsUserLocation }) => {
  return (
    <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
      <Text>Mapa disponível apenas no app nativo</Text>
    </View>
  );
};

NativeMap.Marker = () => null;

export default NativeMap;

