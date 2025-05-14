import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MapProps } from '../types';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const Map: React.FC<MapProps> = ({ center, zoom, markers = [] }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.title}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map; 