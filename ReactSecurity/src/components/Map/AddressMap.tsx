import React, { useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

export type LatLng = { lat: number; lng: number };

interface AddressMapProps {
  value?: LatLng | null;
  onChange?: (coords: LatLng | null) => void;
  readOnly?: boolean;
  height?: number | string;
  className?: string;
}

function ClickHandler({ onPick, disabled }: { onPick: (p: LatLng) => void; disabled?: boolean }) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function AddressMap({ value, onChange, readOnly, height = 360, className = "rounded-md overflow-hidden border border-stroke dark:border-strokedark" }: AddressMapProps) {
  const center = useMemo<LatLngExpression>(() => {
    if (value?.lat != null && value?.lng != null) return [value.lat, value.lng];
    // Centro por defecto (Bogotá aprox)
    return [4.711, -74.072];
  }, [value]);

  const setPoint = (p: LatLng) => onChange?.(p);

  return (
    <div className={className} style={{ height }}>
      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {value?.lat != null && value?.lng != null && (
          <Marker
            position={[value.lat, value.lng]}
            draggable={!readOnly}
            eventHandlers={{
              dragend: (e) => {
                const m = e.target as L.Marker;
                const ll = m.getLatLng();
                setPoint({ lat: ll.lat, lng: ll.lng });
              },
            }}
          />
        )}
        <ClickHandler onPick={setPoint} disabled={readOnly} />
      </MapContainer>
    </div>
  );
}
