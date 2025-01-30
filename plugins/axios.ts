import axios from "axios";

export default defineNuxtPlugin(() => {
  console.log("Axios Plugin: Initialized");

  // 액세스 토큰을 재발급받는 함수
  const refreshAccessToken = async () => {
    console.log("refreshAccessToken: Function invoked");

    try {
      // 서버에 요청하여 새로운 액세스 토큰 발급
      const response = await axios.post("/api/auth/refresh-token", null, {
        withCredentials: true, // HttpOnly 쿠키 전송
      });

      const { accessToken } = response.data;
      console.log("새로운 액세스 토큰:", accessToken);

      // 로컬스토리지에 액세스 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      console.log("Access token saved to localStorage");

      return accessToken;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw new Error("Failed to refresh access token");
    }
  };

  // Axios 요청 인터셉터
  axios.interceptors.request.use(
    async (config) => {
      // 로컬스토리지에서 액세스 토큰 가져오기
      const accessToken = localStorage.getItem("accessToken");

      // 액세스 토큰이 존재하면 Authorization 헤더에 추가
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
        console.log(
          "Authorization Header Added:",
          config.headers["Authorization"]
        );
      }

      return config;
    },
    (error) => {
      console.error("Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  // Axios 응답 인터셉터
  axios.interceptors.response.use(
    (response) => response, // 성공적인 응답은 그대로 반환
    async (error) => {
      const originalRequest = error.config;

      // 401 Unauthorized 응답 처리 (토큰 만료 시)
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // 재시도 플래그 설정

        try {
          console.log("Attempting to refresh access token...");

          // 새로운 액세스 토큰 발급
          const newAccessToken = await refreshAccessToken();
          console.log("New access token acquired:", newAccessToken);

          // 원래 요청에 새로운 액세스 토큰 추가
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // 원래 요청 재시도
          return axios(originalRequest);
        } catch (refreshError) {
          console.error("Failed to refresh access token:", refreshError);
          return Promise.reject(refreshError); // 리프레시 실패 시 에러 반환
        }
      }

      return Promise.reject(error); // 다른 에러는 그대로 반환
    }
  );
});
