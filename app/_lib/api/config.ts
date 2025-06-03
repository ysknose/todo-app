// 変更禁止: 環境設定

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
  retries: 3,
} as const;

export const API_ENDPOINTS = {
  // 認証関連
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
  },

  // ユーザー関連
  USERS: {
    LIST: '/api/users',
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/update',
  },

  // Todo関連
  TODOS: {
    LIST: '/api/todos',
    CREATE: '/api/todos',
    UPDATE: (id: string) => `/api/todos/${id}`,
    DELETE: (id: string) => `/api/todos/${id}`,
  },

  tasks: '/tasks',
  users: '/users',
} as const;

export const API_SETTINGS = {
  // リクエスト設定
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,

  // ページネーション設定
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,

  // キャッシュ設定
  CACHE_TTL: 5 * 60 * 1000, // 5分
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
