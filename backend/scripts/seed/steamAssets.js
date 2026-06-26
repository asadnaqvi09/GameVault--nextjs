const STEAM_API = 'https://store.steampowered.com/api/appdetails';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchSteamGameAssets = async (appId) => {
  try {
    const response = await fetch(`${STEAM_API}?appids=${appId}&l=english`);
    const json = await response.json();
    const entry = json[String(appId)];

    if (!entry?.success || !entry.data) {
      return null;
    }

    const { header_image: coverImage, screenshots = [], movies = [] } = entry.data;
    const topGalleryImages = screenshots
      .slice(0, 4)
      .map((shot) => shot.path_full)
      .filter(Boolean);

    let mainVideoUrl = null;
    if (movies[0]?.mp4?.max) {
      mainVideoUrl = movies[0].mp4.max;
    } else if (movies[0]?.webm?.max) {
      mainVideoUrl = movies[0].webm.max;
    }

    return {
      coverImage: coverImage || topGalleryImages[0] || null,
      topGalleryImages,
      mainVideoUrl
    };
  } catch (error) {
    console.warn(`  Steam API failed for app ${appId}:`, error.message);
    return null;
  }
};

/** Small delay between Steam requests to avoid rate limiting. */
export const fetchSteamGameAssetsThrottled = async (appId, index = 0) => {
  if (index > 0) {
    await delay(350);
  }
  return fetchSteamGameAssets(appId);
};
