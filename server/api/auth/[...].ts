// server/api/auth/[...].ts
import { defineEventHandler, setCookie } from "h3";

export default defineEventHandler(async (event) => {
  // Google OAuth 리다이렉트 URL 생성
  const clientId =
    "223494383653-in3rq3532hghjll1uclub5l57cq1hvt2.apps.googleusercontent.com";
  const redirectUri = `https://ec2-43-203-220-238.ap-northeast-2.compute.amazonaws.com/api/auth/google-callback`;
  const scope = "email profile";

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${encodeURIComponent(scope)}`;

  return { url: authUrl };
});
