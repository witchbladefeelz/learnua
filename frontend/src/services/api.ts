import axios, { AxiosResponse } from 'axios';
import {
  CompletedLesson,
  LeaderboardUser,
  Lesson,
  User,
  LoginResponse,
  PublicUserProfile,
  AdminUserSummary,
  AdminUpdateUserPayload,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      const url: string = error.config?.url || '';
      const authEndpoints = ['/auth/login', '/auth/register', '/auth/verify-email', '/auth/resend-verification'];
      const isAuthRequest = authEndpoints.some(endpoint => url.includes(endpoint));

      if (!isAuthRequest) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const unwrap = <T>(promise: Promise<AxiosResponse<T>>): Promise<T> =>
  promise as unknown as Promise<T>;

export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),

  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/register', data) as Promise<LoginResponse | { message: string }>,

  getProfile: () =>
    unwrap<{ user: User }>(api.get('/auth/profile')),
};

export const usersAPI = {
  getMe: () => unwrap<any>(api.get('/users/me')),

  getUser: (id: string) => unwrap<PublicUserProfile>(api.get(`/users/${id}`)),

  getLeaderboard: (limit?: number) =>
    unwrap<LeaderboardUser[]>(
      api.get(`/users/leaderboard${limit ? `?limit=${limit}` : ''}`),
    ),

  updateProfile: (data: {
    avatar?: string;
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => unwrap<User>(api.patch('/users/me', data)),

  uploadAvatar: (formData: FormData) =>
    unwrap<User>(
      api.patch('/users/me/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    ),
};

export const lessonsAPI = {
  getAll: (category?: string) =>
    unwrap<Lesson[]>(
      api.get(`/lessons${category ? `?category=${category}` : ''}`),
    ),

  getMy: (category?: string) =>
    unwrap<Lesson[]>(
      api.get(`/lessons/my${category ? `?category=${category}` : ''}`),
    ),

  getById: (id: string) =>
    unwrap<Lesson>(api.get(`/lessons/${id}`)),

  getExercises: (id: string) =>
    unwrap<Lesson['exercises']>(api.get(`/lessons/${id}/exercises`)),

  complete: (id: string, data: { score: number; timeSpent: number; answers?: string[] }) =>
    unwrap<CompletedLesson>(api.post(`/lessons/${id}/complete`, data)),

  getMyProgress: () =>
    unwrap(api.get('/lessons/progress/me')),
};

export const progressAPI = {
  getProgress: () =>
    api.get('/progress'),

  getStreak: () =>
    api.get('/progress/streak'),

  getDailyStats: (days?: number) =>
    api.get(`/progress/daily${days ? `?days=${days}` : ''}`),
};

export const achievementsAPI = {
  getAll: () =>
    api.get('/achievements'),

  getMy: () =>
    api.get('/achievements/my'),

  getProgress: () =>
    api.get('/achievements/progress'),

  check: () =>
    api.get('/achievements/check'),
};

export const adminAPI = {
  getUsers: (params?: { skip?: number; take?: number; search?: string }) =>
    unwrap<AdminUserSummary[]>(
      api.get('/admin/users', { params }),
    ),

  updateUser: (id: string, data: AdminUpdateUserPayload) =>
    unwrap<AdminUserSummary>(api.patch(`/admin/users/${id}`, data)),
};

export default api;
