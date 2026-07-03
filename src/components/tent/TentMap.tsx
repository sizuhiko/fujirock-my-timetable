"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let iconsConfigured = false;

// Depending on the bundler, a static image import resolves to either a
// plain URL string or a Next.js StaticImageData object ({ src, ... }).
function resolveAssetUrl(asset: string | { src: string }): string {
  return typeof asset === "string" ? asset : asset.src;
}

// react-leaflet's default marker icon paths assume an asset layout that
// bundlers don't preserve, so we point Leaflet at the bundled image URLs
// explicitly (must run client-side only, hence the module-scope guard).
function ensureDefaultIcon() {
  if (iconsConfigured) return;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: resolveAssetUrl(markerIcon2x),
    iconUrl: resolveAssetUrl(markerIcon),
    shadowUrl: resolveAssetUrl(markerShadow),
  });
  iconsConfigured = true;
}

export default function TentMap({ lat, lng }: { lat: number; lng: number }) {
  useEffect(() => {
    ensureDefaultIcon();
  }, []);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={17}
      style={{ height: "320px", width: "100%", borderRadius: "8px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[lat, lng]} />
    </MapContainer>
  );
}
