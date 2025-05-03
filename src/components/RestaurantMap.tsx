import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface RestaurantMapProps {
  name: string;
  coordinates: [number, number];
  address: string;
}

const RestaurantMap: React.FC<RestaurantMapProps> = ({ name, coordinates, address }) => {
  const position: LatLngExpression = coordinates;

  return (
    <div className="h-full min-h-[300px] rounded-lg overflow-hidden">
      <MapContainer 
        center={position} 
        zoom={15} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="p-2">
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-neutral-600">{address}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default RestaurantMap;