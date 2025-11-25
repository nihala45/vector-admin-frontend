"use client";

import { useFormContext, Controller } from "react-hook-form";
import {
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

type MapInputProps = {
  name: string;
  label: string;
};

type Location = {
  lat: number;
  lng: number;
};

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationPicker = ({
  value,
  onChange,
}: {
  value: Location | null;
  onChange: (pos: Location) => void;
}) => {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng }); // ✅ object
    },
  });

  return value ? <Marker position={[value.lat, value.lng]} icon={markerIcon} /> : null; // ✅ convert to tuple for react-leaflet
};

export const MapInput = ({ name, label }: MapInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="rounded-md overflow-hidden border">
              <MapContainer
                center={
                  field.value
                    ? [field.value.lat, field.value.lng]
                    : [20.5937, 78.9629] // Default India center
                }
                zoom={5}
                style={{ height: "250px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker value={field.value} onChange={field.onChange} />
              </MapContainer>
            </div>
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
};
