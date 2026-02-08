import { refreshApi } from './Login/refreshApi';
import Cookies from 'js-cookie';

// API 요청 옵션 인터페이스
interface FetchOptions {
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  isFormData?: boolean;
  credentials?: string;
}

// 오류 타입 분류
enum ErrorType {
  NEED_LOGIN, // 로그인 필요
  NEED_BACK, // 뒤로가기 필요
  SHOW_MESSAGE, // 메시지 표시
  REFRESH_TOKEN, // 토큰 갱신
}

// 오류 코드별 처리 방식 결정
const getErrorType = (message: string, statusCode?: number): ErrorType => {
  // 1. 로그인 필요 에러
  if (
    message === '유효하지 않은 JWT 토큰입니다.' ||
    message === '지원되지 않는 JWT 토큰입니다.' ||
    message === 'JWT 클레임이 존재하지 않습니다.' ||
    message === '로그아웃 된 사용자입니다. 로그인 후 이용해주세요.'
  ) {
    return ErrorType.NEED_LOGIN;
  }

  // 2. 토큰 갱신 필요 에러
  if (message === 'JWT 토큰이 만료되었습니다.' || statusCode === 401) {
    return ErrorType.REFRESH_TOKEN;
  }

  // 3. 토큰 불일치로 인한 로그인 필요 에러
  if (message === '토큰 갱신이 불가능합니다. 다시 로그인 후 이용해주세요.') {
    return ErrorType.NEED_LOGIN;
  }

  // 4. 뒤로가기 필요 에러
  if (
    message === '데이터가 존재하지 않습니다.' ||
    message === '접근 권한이 없습니다.' ||
    message === '페이지를 찾을 수 없습니다.' ||
    message === '여행지 정보를 찾을 수 없습니다.' ||
    // message === '일정 정보를 찾을 수 없습니다.' ||
    message === '작성자 정보를 찾을 수 없습니다.' ||
    message === '인증되지 않은 사용자입니다. 로그인 후 다시 시도하세요.' ||
    message === '해당 일정에 접근 권한이 없는 사용자 입니다.' ||
    message === '해당 일정에 편집 권한이 없는 사용자 입니다.' ||
    message === '해당 일정에 삭제 권한이 없는 사용자 입니다.' ||
    message === '채팅 권한이 없는 사용자 입니다.' ||
    message === '북마크 정보를 찾을 수 없습니다.' ||
    message === '프로필 이미지 데이터를 찾을 수 없습니다.'
  ) {
    return ErrorType.NEED_BACK;
  }

  // 5. 기타 모든 에러는 메시지 표시
  return ErrorType.SHOW_MESSAGE;
};

// 오류 처리 함수
const handleError = async (
  response: Response,
  responseData: any
): Promise<undefined | never> => {
  const errorType = getErrorType(responseData.message, response.status);

  switch (errorType) {
    case ErrorType.NEED_LOGIN:
      // 로그인 필요한 경우: 쿠키 삭제 후 로그인 페이지로 이동
      Cookies.remove('accessToken');
      Cookies.remove('nickname');
      window.location.href = '/login';
      break;

    case ErrorType.NEED_BACK:
      // 뒤로가기 필요한 경우: 뒤로가기
      window.history.back();
      break;

    case ErrorType.REFRESH_TOKEN:
      // 토큰 갱신 필요한 경우: refreshApi 함수를 사용해 토큰 갱신
      try {
        // 쿠키 관련 유틸리티 함수
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        if (!accessToken && !refreshToken) {
          Cookies.remove('accessToken');
          Cookies.remove('nickname');
          window.location.href = '/login';
          break;
        }

        // refreshApi 함수를 사용해 토큰 갱신
        await refreshApi();

        // 토큰 갱신 성공했으므로 원래 요청을 다시 시도
        // 이 시점에서는 throw하지 않고 재시도를 위해 return 처리
        return undefined;
      } catch (error: any) {
        // 토큰 갱신 실패 시에만 사용자에게 알림
        Cookies.remove('accessToken');
        Cookies.remove('nickname');
        window.location.href = '/login';
      }
      break;

    case ErrorType.SHOW_MESSAGE:
    default:
      // 단순 메시지 표시
      // alert(responseData.message);
      break;
  }

  throw new Error(responseData.message);
};

// API 요청 기본 함수
const fetchData = async <T>(
  method: string,
  endpoint: string,
  body?: any,
  options?: FetchOptions,
  isRetry: boolean = false
): Promise<T> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  //const baseUrl = 'https://www.triptune.co.kr' // 로컬에서만
  const url = `${baseUrl}${endpoint}`;

  // 헤더 설정
  const headers: Record<string, string> = {
    ...(options?.headers || {}),
  };

  // Content-Type 설정 (FormData가 아닌 경우에만)
  if (!options?.isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // 인증 토큰 설정
  if (options?.requiresAuth) {
    const token = Cookies.get('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // 인증이 필요한데 토큰이 없는 경우 로그 출력
      console.warn('인증이 필요한 요청이지만 액세스 토큰이 없습니다:', endpoint);
    }
  }

  // 요청 옵션 설정
  const requestOptions: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  // GET 요청이 아니고 body가 있는 경우
  if (method !== 'GET' && body) {
    requestOptions.body = options?.isFormData ? body : JSON.stringify(body);
  }

  try {
    // 타임아웃 설정 (10초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    requestOptions.signal = controller.signal;

    const response = await fetch(url, requestOptions);
    clearTimeout(timeoutId);

    const data = await response.json();

    // 응답 성공 여부 확인
    if (!response.ok) {
      // 401 에러인 경우, 토큰 갱신 후 재시도
      if (response.status === 401 && !isRetry) {
        // 로그아웃 API 호출인 경우 토큰 갱신 시도하지 않음
        if (endpoint === '/api/members/logout') {
          Cookies.remove('accessToken');
          Cookies.remove('nickname');
          return undefined as unknown as T;
        }

        const token = Cookies.get('accessToken');
        // 토큰이 없는 경우 에러를 throw하여 컴포넌트에서 처리하도록 함
        if (!token) {
          throw new Error('로그인이 필요한 서비스입니다.');
        }

        try {
          await refreshApi();
          // 토큰 갱신 성공 시 원래 요청 재시도
          return await fetchData<T>(method, endpoint, body, options, true);
        } catch (refreshError) {
          // 토큰 갱신 실패 시 로그인 페이지로 이동
          Cookies.remove('accessToken');
          Cookies.remove('nickname');
          window.location.href = '/login';
        }
      }

      try {
        // handleError가 undefined를 반환하면 토큰 갱신 후 재시도를 의미
        const result = await handleError(response, data);

        // 토큰 갱신 후 재시도 (토큰 갱신이 성공했고 아직 재시도하지 않은 경우)
        if (result === undefined && !isRetry) {
          // 토큰이 갱신되었으므로 동일한 요청을 재시도
          return await fetchData<T>(method, endpoint, body, options, true);
        }
      } catch (error) {
        throw error;
      }

      throw new Error(data.message);
    }

    return data as T;
  } catch (error: any) {
    // AbortError (타임아웃) 처리
    if (error.name === 'AbortError') {
      console.error(`⏱️ API 타임아웃: ${endpoint}`);
      throw new Error('요청 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.');
    }

    // 네트워크 에러 처리
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`🌐 네트워크 에러: ${endpoint}`, error.message);
      throw new Error('네트워크 연결에 실패했습니다. 인터넷 연결을 확인해주세요.');
    }

    // 기타 에러는 그대로 전달
    throw error;
  }
};

// HTTP 메서드별 함수
export const get = <T>(endpoint: string, options?: FetchOptions) =>
  fetchData<T>('GET', endpoint, undefined, options);

export const post = <T>(
  endpoint: string,
  body: object,
  options?: FetchOptions
) => fetchData<T>('POST', endpoint, body, options);

export const patch = <T>(
  endpoint: string,
  body: object,
  options?: FetchOptions
) => fetchData<T>('PATCH', endpoint, body, options);

export const remove = <T>(
  endpoint: string,
  body?: object,
  options?: FetchOptions
) => fetchData<T>('DELETE', endpoint, body, options);
