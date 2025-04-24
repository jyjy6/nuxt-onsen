// server/api/auth/[...].ts
import { defineEventHandler, setCookie } from "h3";

export default defineEventHandler(async (event) => {
  // Google OAuth 리다이렉트 URL 생성
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.AUTH_ORIGIN}/api/auth/google-callback`;
  const scope = "email profile";

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scope)}`;

  return { url: authUrl };
});
