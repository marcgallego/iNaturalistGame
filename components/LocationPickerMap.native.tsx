import MapView, { Circle, Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native';

import { MapProps } from '@/components/LocationPicker.types';
import { colors } from '@/theme/theme';

function regionForRadius(lat: number, lng: number, radiusKm: number) {
  // ~111 km per degree of latitude; pad so the circle fits comfortably.
  const delta = (radiusKm / 111) * 2.6;
  return {
    latitude: lat,
    longitude: lng,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

export default function LocationPickerMap({
  lat,
  lng,
  radiusKm,
  onPick,
}: MapProps) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      region={regionForRadius(lat, lng, radiusKm)}
      onPress={(e) =>
        onPick(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
      }
    >
      <Marker
        draggable
        coordinate={{ latitude: lat, longitude: lng }}
        onDragEnd={(e) =>
          onPick(
            e.nativeEvent.coordinate.latitude,
            e.nativeEvent.coordinate.longitude,
          )
        }
      />
      <Circle
        center={{ latitude: lat, longitude: lng }}
        radius={radiusKm * 1000}
        strokeColor={colors.accent}
        fillColor="rgba(58, 107, 53, 0.12)"
        strokeWidth={2}
      />
    </MapView>
  );
}
