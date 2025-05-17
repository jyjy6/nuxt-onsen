import { defineEventHandler, setCookie } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // 리프레시 토큰을 삭제하기 위해 쿠키 초기화
    setCookie(event, "refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // 즉시 만료
      domain:
        process.env.NODE_ENV === "production"
          ? process.env.AUTH_ORIGIN
          : "",
    });

    // 필요 시, 서버 측에서 리프레시 토큰 무효화 로직 추가
    // 예: 데이터베이스에서 토큰 삭제 또는 블랙리스트에 추가
    // const token = event.req.cookies["refreshToken"];
    // await RefreshTokenModel.deleteOne({ token });

    return {
      success: true,
      message: "Logout successful. Refresh token removed.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Logout failed.",
      error,
    };
  }
});
