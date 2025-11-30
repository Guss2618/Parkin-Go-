import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';

const NativeMap = ({ children, initialRegion, region, style, showsUserLocation }) => {
  const currentRegion = region || initialRegion;
  
  return (
    <MapView 
      style={style} 
      initialRegion={initialRegion}
      region={currentRegion}
      showsUserLocation={showsUserLocation}
    >
      {children}
    </MapView>
  );
};

NativeMap.Marker = Marker;
NativeMap.Circle = Circle;

export default NativeMap;

