// src/app/lib/api-client-form-data.ts (atau sesuaikan nama filemu)
import axios from 'axios';

// Menentukan Base URL berdasarkan environment Next.js
const BASE_URL = process.env.NODE_ENV === 'development'
  ? process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:3000/api'
  : process.env.NEXT_PUBLIC_API_URL_PROD;

export const apiClientFormData = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// Interceptor Response untuk menangkap error
apiClientFormData.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengunggah file';
    
    console.error('API Upload Error:', errorMessage);

    return Promise.reject(error);
  }
);

export default apiClientFormData;
