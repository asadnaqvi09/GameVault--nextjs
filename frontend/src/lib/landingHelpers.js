/** Change this slug to pin a different game on the landing Single_Game section. */
export const LANDING_FEATURED_GAME_SLUG = 'lies-of-p';

const DEFAULT_GENRE_BG =
  'https://woodmart.xtemos.com/games/wp-content/uploads/sites/14/2023/05/wd-vgs-action-w-220x130.jpg';

const GENRE_BG_BY_NAME = {
  Action: DEFAULT_GENRE_BG,
  Adventure: DEFAULT_GENRE_BG,
  Casual: DEFAULT_GENRE_BG,
  Horror: DEFAULT_GENRE_BG,
  Indie: DEFAULT_GENRE_BG,
  Racing: DEFAULT_GENRE_BG,
  Simulation: DEFAULT_GENRE_BG,
  RPG: DEFAULT_GENRE_BG,
};

export function formatHeroReleaseDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}`;
}

export function pickCheapestDiscountedGames(games, count = 5) {
  return [...games]
    .filter((g) => g.oldPrice != null && g.price < g.oldPrice)
    .sort((a, b) => a.price - b.price)
    .slice(0, count);
}

export function getGenreBgImage(genreName) {
  return GENRE_BG_BY_NAME[genreName] ?? DEFAULT_GENRE_BG;
}

export function mapGameToHeroSlide(game) {
  const bannerImg =
    game.detailedDescription?.topGalleryImages?.[0] ||
    game.coverImage ||
    game.image ||
    '';

  return {
    id: game.id,
    img: bannerImg,
    logo: game.coverImage || bannerImg,
    title: game.title,
    Available_Platforms: game.options?.platforms || [],
    text: game.smallDescription || '',
    releaseDate: formatHeroReleaseDate(game.specifications?.releaseDate),
  };
}

export function buildAdvertiseStatus(game) {
  if (game.discountPercent > 0) {
    return `Discount off ${game.discountPercent}%`;
  }
  if (game.tags?.includes('Hot')) return 'Red Hot Deal';
  const platform = game.options?.platforms?.[0];
  if (platform) return `Now on ${platform}`;
  return 'Featured';
}

const ADVERTISE_BUTTON_LABELS = ['Buy Now', 'To Shop', 'Explore', 'Buy Now'];

export function getAdvertiseButtonText(index) {
  return ADVERTISE_BUTTON_LABELS[index % ADVERTISE_BUTTON_LABELS.length];
}
