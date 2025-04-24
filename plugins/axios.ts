import axios from "axios";

export default defineNuxtPlugin((nuxtApp) => {


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

  // Nuxt 앱 컨텍스트에 axios 인터셉터 추가

  const addAxiosInterceptors = () => {
    // 요청 인터셉터
    axios.interceptors.request.use(
      async (config) => {
        console.log("Axios Request Interceptor - Start");

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

        console.log("Axios Request Interceptor - End");
        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    axios.interceptors.response.use(
      (response) => {
        console.log("Axios Response Interceptor - Success");
        return response;
      },
      async (error) => {
        console.log("Axios Response Interceptor - Error");
        const originalRequest = error.config;

        // `/api/auth/login` 요청이면 인터셉터 적용 안 함
        if (originalRequest.url === "/api/auth/login") {
          console.log("Login request, skipping interceptor");
          return Promise.reject(error);
        }

        // 401 Unauthorized 응답 처리 (토큰 만료 시)
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          console.log("401 Unauthorized, attempting token refresh");
          originalRequest._retry = true; // 재시도 플래그 설정

          try {
            // 새로운 액세스 토큰 발급
            console.log("액세스토큰 발급");
            const newAccessToken = await refreshAccessToken();
            console.log("New access token acquired:", newAccessToken);

            // 원래 요청에 새로운 액세스 토큰 추가
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;

            console.log("액세스토큰 발급완료");
            // 원래 요청 재시도
            return axios(originalRequest);
          } catch (refreshError) {
            console.error("Failed to refresh access token:", refreshError);
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  };

  // Nuxt 앱이 준비되면 인터셉터 추가
  nuxtApp.hook("app:mounted", () => {
    console.log("Nuxt App Mounted - Adding Axios Interceptors");
    addAxiosInterceptors();
  });
});
