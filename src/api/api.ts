const BASE_URL = 'http://13.209.177.247:8080/api';

const fetchOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  redirect: 'follow', // 'follow', 'error', 'manual'
  cache: 'no-cache', // 'default', 'no-store', 'reload', 'no-cache', 'force-cache', 'only-if-cached'
  credentials: 'same-origin', // 'omit', 'same-origin', 'include'
};

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

export const fetchData = async <T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...fetchOptions,
    ...options,
    headers: {
      ...fetchOptions.headers,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API 요청 실패');
  }
  
  return response.json();
};

export const get = <T>(endpoint: string, options?: FetchOptions) => {
  return fetchData<T>(endpoint, { method: 'GET', ...options });
};

export const post = <T>(
  endpoint: string,
  body: unknown,
  options?: FetchOptions
) => {
  return fetchData<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
  });
};

export const put = <T>(
  endpoint: string,
  body: unknown,
  options?: FetchOptions
) => {
  return fetchData<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    ...options,
  });
};

export const patch = <T>(
  endpoint: string,
  body: unknown,
  options?: FetchOptions
) => {
  return fetchData<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
    ...options,
  });
};

export const del = <T>(endpoint: string, options?: FetchOptions) => {
  return fetchData<T>(endpoint, { method: 'DELETE', ...options });
};