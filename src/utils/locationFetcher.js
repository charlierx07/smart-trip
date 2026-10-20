export const fetchNearbyPlaces = async (lat, lon) => {
  const radius = 15000; // 15 km

  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["leisure"="park"](around:${radius},${lat},${lon});
      node["leisure"="garden"](around:${radius},${lat},${lon});
      node["leisure"="water_park"](around:${radius},${lat},${lon});
      node["tourism"="theme_park"](around:${radius},${lat},${lon});
      node["tourism"="attraction"](around:${radius},${lat},${lon});
      node["tourism"="museum"](around:${radius},${lat},${lon});
      node["historic"](around:${radius},${lat},${lon});
      node["amenity"="place_of_worship"](around:${radius},${lat},${lon});
    );
    out body;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(overpassQuery)}`
    });

    const data = await response.json();

    if (!data.elements) return [];

    return data.elements.map((el) => ({
      id: el.id,
      name: el.tags?.name || 'Unnamed Place',
      type:
        el.tags?.tourism ||
        el.tags?.leisure ||
        el.tags?.historic ||
        el.tags?.amenity ||
        'Unknown',
      lat: el.lat,
      lon: el.lon,
      distance: null, // Optional: calculate later if needed
    }));
  } catch (error) {
    console.error("Error fetching from Overpass API:", error);
    return [];
  }
};
