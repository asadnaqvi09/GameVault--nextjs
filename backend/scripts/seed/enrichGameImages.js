import {
  STEAM_APP_IDS,
  STATIC_GAME_ASSETS,
  isPlaceholderImageUrl
} from './gameImageAssets.js';
import { fetchSteamGameAssetsThrottled } from './steamAssets.js';

const patchFeatureImages = (features = [], gallery = []) => {
  if (!Array.isArray(features)) return features;

  let galleryIndex = 0;
  return features.map((feature) => {
    const needsImage = !feature.image || isPlaceholderImageUrl(feature.image);
    if (!needsImage) return feature;

    const image = gallery[galleryIndex % gallery.length] || null;
    if (image) galleryIndex += 1;

    return { ...feature, image };
  });
};

export const enrichGameImages = async (game, index = 0) => {
  const slug = game.id;
  const detailed = { ...(game.detailedDescription || {}) };
  let coverImage = game.coverImage && !isPlaceholderImageUrl(game.coverImage)
    ? game.coverImage
    : null;

  let topGalleryImages = (detailed.topGalleryImages || []).filter(
    (url) => !isPlaceholderImageUrl(url)
  );
  let mainVideoUrl = detailed.mainVideoUrl || null;

  const steamAppId = STEAM_APP_IDS[slug];
  if (steamAppId) {
    const steamAssets = await fetchSteamGameAssetsThrottled(steamAppId, index);
    if (steamAssets) {
      coverImage = steamAssets.coverImage;
      topGalleryImages = steamAssets.topGalleryImages;
      if (!mainVideoUrl && steamAssets.mainVideoUrl) {
        mainVideoUrl = steamAssets.mainVideoUrl;
      }
      console.log(`  ✓ Steam assets: ${game.title}`);
    } else {
      console.warn(`  ⚠ Steam fetch failed: ${game.title}`);
    }
  }

  const staticAssets = STATIC_GAME_ASSETS[slug];
  if (staticAssets) {
    coverImage = staticAssets.coverImage || coverImage;
    topGalleryImages = staticAssets.topGalleryImages?.length
      ? staticAssets.topGalleryImages
      : topGalleryImages;
    console.log(`  ✓ Static assets: ${game.title}`);
  }

  if (topGalleryImages.length === 0 && coverImage) {
    topGalleryImages = [coverImage];
  }

  if (!coverImage && topGalleryImages[0]) {
    coverImage = topGalleryImages[0];
  }

  const features = patchFeatureImages(detailed.features, topGalleryImages);

  return {
    ...game,
    coverImage,
    detailedDescription: {
      ...detailed,
      topGalleryImages,
      mainVideoUrl,
      features
    }
  };
};
