export type Scene = {
  src: string;
  alt: string;
};

export const SCENES = {
  cape: {
    src: "/media/table-mountain.jpg",
    alt: "Table Mountain from the Atlantic shore",
  },
  safari: {
    src: "/media/safari.jpg",
    alt: "Elephants on Southern African savanna",
  },
  wine: {
    src: "/media/stellenbosch.jpg",
    alt: "Vineyards under the mountains near Stellenbosch",
  },
  mountain: {
    src: "/media/drakensberg.jpg",
    alt: "The Drakensberg escarpment",
  },
  ocean: {
    src: "/media/durban-beach.jpg",
    alt: "Durban beach and the Golden Mile",
  },
  coast: {
    src: "/media/knysna-heads.jpg",
    alt: "The Knysna Heads on the Garden Route",
  },
  lion: {
    src: "/media/african-lion.jpg",
    alt: "A lion in Southern African grassland",
  },
} as const;

const FALLBACKS: Scene[] = [
  SCENES.ocean,
  SCENES.mountain,
  SCENES.wine,
  SCENES.coast,
];

export function sceneFor(destination: string): Scene {
  const place = destination.toLowerCase();
  if (
    /stellenbosch|franschhoek|paarl|constantia|winelands/.test(place)
  ) {
    return SCENES.wine;
  }
  if (
    /cape town|camps bay|hout bay|sea point|waterfront/.test(place)
  ) {
    return SCENES.cape;
  }
  if (
    /kruger|pilanesberg|hoedspruit|skukuza|hazyview|mbombela|phalaborwa|sun city|addo/.test(
      place,
    )
  ) {
    return SCENES.safari;
  }
  if (
    /durban|umhlanga|ballito|jeffreys|gqeberha|port elizabeth|east london/.test(
      place,
    )
  ) {
    return SCENES.ocean;
  }
  if (/knysna|plett|garden|george|hermanus|overberg|mossel/.test(place)) {
    return SCENES.coast;
  }
  if (/drakensberg|qwaqwa|royal natal|uKhahlamba/i.test(place)) {
    return SCENES.mountain;
  }

  let hash = 0;
  for (const char of place) {
    hash = (hash + char.charCodeAt(0)) % FALLBACKS.length;
  }
  return FALLBACKS[hash] ?? SCENES.ocean;
}

export const HERO_FILM = {
  src: "/media/cape-town.webm",
  poster: SCENES.cape.src,
};

export const MEDIA_CREDIT =
  "Photographs and Cape Town film from Wikimedia Commons.";
