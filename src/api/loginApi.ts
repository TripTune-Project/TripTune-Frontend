import saveLocalContent from '../utils/saveLocalContent';

interface LoginData {
  userId: string;
  password: string;
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

export const loginUser = async (data: LoginData) => {
  try {
    const response = await fetch('/members/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || '로그인 실패';
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    const { accessToken, refreshToken, userId } = responseData.data;

    saveTokens(accessToken, refreshToken, userId);

    return responseData;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : '로그인 실패');
  }
};
