import axios, { type AxiosError } from 'axios'
import { getCookie } from '@/lib/cookies'

const ACCESS_TOKEN =
  import.meta.env.VITE_ACCESS_TOKEN || 'thisIsJustRandomString'
const BASE_URL =
  import.meta.env.VITE_API_URL_NODE_ENVIRONMENT === 'DEVELOPMENT'
    ? import.meta.env.VITE_API_URL_DEVELOPMENT
    : import.meta.env.VITE_API_URL_PRODUCTION

const apiClientFormData = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

// Function to get auth token from cookie
function getAuthToken(): string | null {
  const tokenCookie = getCookie(ACCESS_TOKEN)

  // If token cookie is undefined, logout the user
  if (tokenCookie === undefined) {
    handleLogout()
    return null
  }

  if (tokenCookie && tokenCookie !== 'undefined') {
    try {
      const token = JSON.parse(tokenCookie)
      // Return token even if expired - let the server handle expiration
      return token
    } catch {
      // If parsing fails, still try to logout and return null
      handleLogout()
      return null
    }
  }

  // If tokenCookie is null or 'undefined' string, logout the user
  handleLogout()
  return null
}

// Function to handle logout
async function handleLogout() {
  try {
    const { useAuthStore } = await import('@/stores/auth-store')
    useAuthStore.getState().auth.reset()
  } catch {
    // Silent fail - user will be redirected on next navigation
  }
}

// Request interceptor to add auth token
apiClientFormData.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClientFormData.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { auth, setErrorAuthMessage } = await import(
      '@/stores/auth-store'
    ).then((m) => m.useAuthStore.getState())

    if (error.response?.status === 401 || error.response?.status === 403) {
      setErrorAuthMessage(
        error.response?.data?.message || 'Authentication Error'
      )
    }

    // Check if error is 401 and not a retry
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      auth.refreshToken
    ) {
      originalRequest._retry = true

      try {
        // Call refresh token endpoint
        // Note: We use axios directly to avoid interceptors loop if this fails
        // But here we can use the instance if we are careful, or create a new one.
        // Let's use a fresh axios call for safety to avoid attaching old token if not needed,
        // though the endpoint likely needs the refresh token in body.
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken: auth.refreshToken,
        })

        const { accessToken: accessToken, refreshToken: refreshToken } =
          response.data.data

        // Update tokens in store
        auth.setTokens(accessToken, refreshToken)

        // Update authorization header for original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        // Retry original request
        return apiClientFormData(originalRequest)
      } catch (refreshError) {
        // Refresh failed (expired or invalid)
        const err = refreshError as AxiosError<{ message?: string }>

        auth.reset()
        setErrorAuthMessage(
          err.response?.data?.message || 'Authentication Error'
        )

        return Promise.reject(refreshError)
      }
    }

    // If 401 and no refresh token, or retry failed
    if (error.response?.status === 401) {
      setErrorAuthMessage(
        error.response?.data?.message || 'Authentication Error'
      )
      auth.reset()
    }

    return Promise.reject(error)
  }
)

export default apiClientFormData
