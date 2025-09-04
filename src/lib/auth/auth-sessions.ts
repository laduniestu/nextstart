export const sessionConfig = {
  expiresIn: 60 * 60 * 24, // 1 day
  updateAge: 60 * 60, // 1 hour (every 1 hour the session expiration is updated)
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60, // Cache duration in seconds
  },
};
