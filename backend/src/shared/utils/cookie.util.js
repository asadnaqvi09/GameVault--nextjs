const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

export const refreshTokenCookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  maxAge: REFRESH_TOKEN_MAX_AGE,
};

export const clearRefreshTokenCookieOptions = {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};
