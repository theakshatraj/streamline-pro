import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class ApiService {
  private async request(endpoint: string, options: RequestInit = {}) {
    const { accessToken, refreshToken, updateToken, logout } = useAuthStore.getState();
    
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options.headers,
      },
      ...options,
    };
    
    try {
      const response = await fetch(url, config);
      
      // Handle token refresh
      if (response.status === 401 && refreshToken) {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        
        if (refreshResponse.ok) {
          const { data } = await refreshResponse.json();
          updateToken(data.accessToken);
          
          // Retry original request
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${data.accessToken}`,
          };
          return fetch(url, config);
        } else {
          logout();
          throw new Error('Session expired');
        }
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  }
  
  async get(endpoint: string) {
    const response = await this.request(endpoint);
    return response.json();
  }
  
  async post(endpoint: string, data: any) {
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }
  
  async put(endpoint: string, data: any) {
    const response = await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  }
  
  async delete(endpoint: string) {
    const response = await this.request(endpoint, {
      method: 'DELETE',
    });
    return response.json();
  }
}

export const apiService = new ApiService();

// Auth API methods
export const authAPI = {
  register: (userData: any) => apiService.post('/auth/register', userData),
  login: (credentials: any) => apiService.post('/auth/login', credentials),
  refreshToken: (refreshToken: string) => apiService.post('/auth/refresh', { refreshToken }),
};