/**
 * Steam App ID per game slug. Used at seed time to fetch real header + screenshots.
 */
export const STEAM_APP_IDS = {
  'baldurs-gate-3': 1086940,
  'elden-ring': 1245620,
  'cyberpunk-2077': 1091500,
  'hogwarts-legacy': 990080,
  'resident-evil-4-remake': 2050650,
  'marvels-spider-man-2': 2651280,
  'god-of-war-ragnarok': 2322010,
  'diablo-iv': 2344520,
  'forza-horizon-5': 1551360,
  'cities-skylines-2': 949230,
  'hollow-knight-silksong': 1030300,
  'stardew-valley': 413150,
  'celeste': 504230,
  'dead-by-daylight': 381210,
  'dave-the-diver': 1868140,
  'lies-of-p': 1627720,
  'sea-of-stars': 1244090,
  'lies-of-the-mind-pacific-drive': 1458140,
  'hades': 1145360
};

/**
 * Games not on Steam (or unreliable API). Curated official/promotional assets.
 */
export const STATIC_GAME_ASSETS = {
  'alan-wake-2': {
    coverImage:
      'https://cdna.artstation.com/p/assets/images/images/065/640/122/large/oliver-odmark-juhani-jokinen-alan-wake-2-keyart.jpg',
    topGalleryImages: [
      'https://cdna.artstation.com/p/assets/images/images/065/640/122/large/oliver-odmark-juhani-jokinen-alan-wake-2-keyart.jpg',
      'https://cdna.artstation.com/p/assets/images/images/065/640/122/medium/oliver-odmark-juhani-jokinen-alan-wake-2-keyart.jpg?1690876170'
    ]
  }
};

/** JSON genres that are not in the Genre enum — mapped before DB insert. */
export const GENRE_ALIASES = {
  Indie: 'Adventure',
  Casual: 'Simulation'
};

/** Placeholder screenshot hashes repeated across unrelated games in the JSON. */
const PLACEHOLDER_HASHES = new Set([
  'ss_e1b8c1e1f8e3d3e2e2e4e0b3e9a7e7c5e6b5e9a5',
  'ss_91f8e2c3e1b9e4e2e4e0b3e9a7e7c5e6b5e9a5c2',
  'ss_a7b8e2c3e1b9e4e2e4e0b3e9a7e7c5e6b5e9a5d4',
  'ss_b2c3e1b9e4e2e4e0b3e9a7e7c5e6b5e9a5c2d4e6',
  'ss_d4e6a8b2c3e1b9e4e2e4e0b3e9a7e7c5e6b5e9a5',
  'ss_e1a8e1e1f8e3d3e2e2e4e0b3e9a7e7c5e6b5e9a5',
  'ss_b4e2e4e0b3e9a7e7c5e6b5e9a5d4e6a8b2c3e1b9',
  'ss_e1b9e4e2e4e0b3e9a7e7c5e6b5e9a5d4e6a8b2c3',
  'ss_a5d4e6a8b2c3e1b9e4e2e4e0b3e9a7e7c5e6b5e9',
  'ss_b4d2f4e0b3e9a7e7c5e6b5e9a5d4e6a8b2c3e1b9',
  'ss_b9e4e2e4e0b3e9a7e7c5e6b5e9a5d4e6a8b2c3e1',
  'ss_b7a05cf5e7e3e7e7b8c5df3e0b4e9a6e8b7e8c5e',
  'ss_a5e09f5e09e72a82e2e4db7e2e4e0b7e3d7d8a56'
]);

export const isPlaceholderImageUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  if (url.includes('woodmart.xtemos.com')) return true;
  for (const hash of PLACEHOLDER_HASHES) {
    if (url.includes(hash)) return true;
  }
  return false;
};
