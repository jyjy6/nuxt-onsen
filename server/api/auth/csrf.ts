// server/api/csrf.ts
import { defineEventHandler, setCookie } from "h3";
import { randomUUID } from "crypto";

export default defineEventHandler((event) => {
  const csrfToken = randomUUID();

  setCookie(event, "csrf-token", csrfToken, {
    httpOnly: true,
    // secure: process.env.NODE_ENV === "production",
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  console.log("csrfToken발급됨!:" + csrfToken);
  return { csrfToken };
});
