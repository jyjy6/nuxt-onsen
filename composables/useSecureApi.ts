// composables/useSecureApi.ts
import axios, { AxiosError } from "axios";
import { ref } from "vue";

export const useSecureApi = () => {
  const csrfToken = ref<string | null>(null);
  const isLoading = ref(false);
  const error = ref<AxiosError | null>(null);

  const getCsrfTokenFromCookie = () => {
    const match = document.cookie.match(/(^| )csrf-token=([^;]+)/);
    return match ? match[2] : null; // 쿠키에서 'csrf-token' 값 추출
  };

  // CSRF 토큰 가져오기
  const fetchCsrfToken = async () => {
    if (csrfToken.value) return csrfToken.value;

    const tokenFromCookie = getCsrfTokenFromCookie(); // 쿠키에서 가져오기
    if (tokenFromCookie) {
      csrfToken.value = tokenFromCookie;
      return csrfToken.value;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await axios.get("/api/auth/csrf");
      csrfToken.value = response.data.csrfToken;
      return csrfToken.value;
    } catch (err) {
      console.error("CSRF 토큰을 가져오는 데 실패했습니다:", err);
      error.value = err as AxiosError;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  // 보안 POST 요청
  const securePost = async (url: string, data: any) => {
    console.log("보안POST요청발동");
    const token = await fetchCsrfToken();

    return axios.post(url, data, {
      //헤더는 미들웨어에서 검증하기위한것 쿠키검증은 필요없음
      headers: {
        "X-CSRF-Token": token,
      },
    });
  };

  // 보안 PUT 요청
  const securePut = async (url: string, data: any) => {
    console.log("보안PUT요청발동");
    const token = await fetchCsrfToken();

    return axios.put(url, data, {
      headers: {
        "X-CSRF-Token": token,
      },
    });
  };

  // 보안 DELETE 요청
  const secureDelete = async (url: string) => {
    console.log("보안delete요청발동");
    const token = await fetchCsrfToken();

    return axios.delete(url, {
      headers: {
        "X-CSRF-Token": token,
      },
    });
  };

  return {
    fetchCsrfToken,
    securePost,
    securePut,
    secureDelete,
    isLoading,
    error,
  };
};
