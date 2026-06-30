export const ALLOWED_GENRES = [
  'Action',
  'Adventure',
  'RPG',
  'Strategy',
  'Simulation',
  'Sports',
  'Racing',
  'Fighting',
  'Horror',
];

export const emptyGameForm = () => ({
  id: '',
  title: '',
  price: '',
  oldPrice: '',
  genre: 'Action',
  smallDescription: '',
  coverImage: '',
  gameMode: 'Single-player',
  ageRestrictionBadge: '',
  tags: '',
  platforms: 'PC',
  editions: 'Standard',
  releaseDate: '',
  publisher: '',
  developer: '',
  languages: 'English',
  audio: 'English',
  galleryImages: '',
  mainVideoUrl: '',
  isActive: true,
});

export const gameToForm = (game) => ({
  id: game.id || '',
  title: game.title || '',
  price: game.price ?? '',
  oldPrice: game.oldPrice ?? '',
  genre: game.genre || 'Action',
  smallDescription: game.smallDescription || '',
  coverImage: game.coverImage || '',
  gameMode: game.gameMode || 'Single-player',
  ageRestrictionBadge: game.ageRestrictionBadge || '',
  tags: (game.tags || []).join(', '),
  platforms: (game.options?.platforms || []).join(', '),
  editions: (game.options?.editions || []).join(', '),
  releaseDate: game.specifications?.releaseDate || '',
  publisher: game.specifications?.publisher || '',
  developer: game.specifications?.developer || '',
  languages: (game.specifications?.languages || []).join(', '),
  audio: (game.specifications?.audio || []).join(', '),
  galleryImages: (game.detailedDescription?.topGalleryImages || []).join('\n'),
  mainVideoUrl: game.detailedDescription?.mainVideoUrl || '',
  isActive: game.isActive !== false,
});

const splitList = (value) =>
  String(value || '')
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

export const formToPayload = (form, isEdit = false) => {
  const payload = {
    title: form.title.trim(),
    price: Number(form.price),
    oldPrice: form.oldPrice === '' || form.oldPrice === null ? null : Number(form.oldPrice),
    genre: form.genre,
    smallDescription: form.smallDescription.trim(),
    coverImage: form.coverImage.trim() || null,
    gameMode: form.gameMode.trim(),
    ageRestrictionBadge: form.ageRestrictionBadge.trim() || null,
    tags: splitList(form.tags),
    options: {
      platforms: splitList(form.platforms),
      editions: splitList(form.editions),
    },
    specifications: {
      releaseDate: form.releaseDate,
      publisher: form.publisher.trim(),
      developer: form.developer.trim(),
      languages: splitList(form.languages),
      audio: splitList(form.audio),
    },
    detailedDescription: {
      topGalleryImages: splitList(form.galleryImages),
      mainVideoUrl: form.mainVideoUrl.trim() || null,
      features: [],
    },
    isActive: Boolean(form.isActive),
  };
  if (!isEdit) {
    payload.id = form.id.trim().toLowerCase();
  }
  return payload;
};
