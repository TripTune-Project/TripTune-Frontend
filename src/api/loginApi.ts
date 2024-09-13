import axios from 'axios';
import saveLocalContent from '../utils/saveLocalContent';

interface LoginData {
  userId: string;
  password: string;
}

interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    userId: string;
  };
}

const { setEncryptedCookie } = saveLocalContent();

const saveTokens = (
  accessToken: string,
  refreshToken: string,
  userId: string
) => {
  setEncryptedCookie('trip-tune_at', accessToken, 5 / (24 * 60));
  setEncryptedCookie('trip-tune_rt', refreshToken, 7);
  setEncryptedCookie('userId', userId, 7);
};

export const loginUser = async (
  data: LoginData
): Promise<LoginResponse['data']> => {
  try {
    const response = await axios.post<LoginResponse>(
      'http://13.209.177.247:8080/api/members/login',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { accessToken, refreshToken, userId } = response.data.data;

    saveTokens(accessToken, refreshToken, userId);

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
  }
};
