// src/app/lib/api-client.ts
import axios from 'axios';

// Menentukan Base URL berdasarkan environment Next.js
const BASE_URL = process.env.NODE_ENV === 'development'
  ? process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:3000/api'
  : process.env.NEXT_PUBLIC_API_URL_PROD;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor Response (Opsional: hanya untuk menangkap error secara global)
apiClient.interceptors.response.use(
  (response) => {
    // Jika respons sukses, kembalikan langsung datanya agar di FE lebih ringkas
    return response;
  },
  (error) => {
    // Tangkap pesan error dari API kita atau kembalikan pesan bawaan
    const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan pada server';
    
    // Kamu bisa tambahkan toast/snackbar notification di sini nanti jika mau
    console.error('API Error:', errorMessage);

    return Promise.reject(error);
  }
);

export default apiClient;
