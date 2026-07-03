export function buildArtistUrl(contentId: string): string {
  return `https://www.fujirockfestival.com/artist/detail/${contentId}`;
}

export function buildGoogleMapsWalkingUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`;
}

export function openInNewTab(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
