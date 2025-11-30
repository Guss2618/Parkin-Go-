import React, { useEffect, useRef } from 'react';

const WebMap = ({ initialRegion, region, markers = [], style, selectedEstado }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const selectedMarkerRef = useRef(null);
  const selectedCircleRef = useRef(null);
  const currentRegion = region || initialRegion;

  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      const L = require('leaflet');
      require('leaflet/dist/leaflet.css');

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const center = [currentRegion.latitude, currentRegion.longitude];
      const zoom = 13;

      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && currentRegion) {
      const center = [currentRegion.latitude, currentRegion.longitude];
      const zoom = currentRegion.latitudeDelta ? Math.log2(360 / currentRegion.latitudeDelta) : 13;
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [currentRegion]);

  useEffect(() => {
    if (mapInstanceRef.current && markers && markers.length > 0) {
      const L = require('leaflet');
      
      markersRef.current.forEach(marker => {
        if (marker) marker.remove();
      });
      markersRef.current = [];

      markers.forEach((markerData) => {
        const marker = L.marker([markerData.latitude, markerData.longitude])
          .addTo(mapInstanceRef.current)
          .bindPopup(`<strong>${markerData.title}</strong><br/>${markerData.description}`)
          .on('click', () => {
            if (markerData.onPress) markerData.onPress(markerData);
          });
        markersRef.current.push(marker);
      });
    }
  }, [markers]);

  useEffect(() => {
    if (mapInstanceRef.current && selectedEstado) {
      const L = require('leaflet');
      
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.remove();
      }
      if (selectedCircleRef.current) {
        selectedCircleRef.current.remove();
      }

      const customIcon = L.divIcon({
        className: 'custom-marker-selected',
        html: `<div style="
          width: 30px;
          height: 30px;
          background-color: #003366;
          border: 3px solid #fff;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      selectedMarkerRef.current = L.marker(
        [selectedEstado.latitude, selectedEstado.longitude],
        { icon: customIcon }
      )
        .addTo(mapInstanceRef.current)
        .bindPopup(`<strong>${selectedEstado.nome}</strong>`)
        .openPopup();

      selectedCircleRef.current = L.circle(
        [selectedEstado.latitude, selectedEstado.longitude],
        {
          radius: 150000,
          color: '#003366',
          fillColor: '#003366',
          fillOpacity: 0.2,
          weight: 3,
        }
      ).addTo(mapInstanceRef.current);
    } else {
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.remove();
        selectedMarkerRef.current = null;
      }
      if (selectedCircleRef.current) {
        selectedCircleRef.current.remove();
        selectedCircleRef.current = null;
      }
    }
  }, [selectedEstado]);

  const divStyle = {
    height: '100%',
    width: '100%',
    position: 'relative',
    zIndex: 1,
    ...style
  };

  return React.createElement('div', { ref: mapRef, style: divStyle });
};

export default WebMap;

