import axios from "axios";

// axios 인스턴스 생성
const api = axios.create({
    baseURL: "http://localhost:9000", // 기본 URL 설정
  });
  
  // 요청 인터셉터 (필요 시 헤더 추가 가능)
  api.interceptors.request.use(
    (config) => {
      // 예: 토큰 추가 가능
      // config.headers.Authorization = 'Bearer yourToken';
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // 응답 인터셉터 (에러 처리 등 가능)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error("API Error:", error);
      return Promise.reject(error);
    }
  );
  
  export default api;