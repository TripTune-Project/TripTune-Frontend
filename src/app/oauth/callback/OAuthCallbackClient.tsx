'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import saveLocalContent from '@/utils/saveLocalContent';
import useAuth from '@/hooks/useAuth';
import VerificationLoading from '@/components/Common/VerificationLoading';

export default function OAuthCallbackClient() {
  const router = useRouter();
  const { setEncryptedCookie } = saveLocalContent();
  const { updateAuthStatus } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // TODO : 알아보는 코드 !!!
        console.log('OAuth 콜백 처리 시작');

        const response = await fetch('/api/auth/oauth/callback', {
          method: 'GET',
          credentials: 'include',
        });

        console.log('응답 상태:', response.status);

        console.log(
          '응답 헤더:',
          Object.fromEntries(response.headers.entries())
        );

        const data = await response.json();
        console.log('백엔드 응답 데이터:', data);

        const { accessToken, refreshToken, nickname } = data;

        if (!accessToken || !refreshToken || !nickname) {
          console.error('필수 파라미터 누락:', {
            accessToken: !accessToken,
            refreshToken: !refreshToken,
            nickname: !nickname,
          });
          throw new Error('소셜 로그인에 실패했습니다.');
        }

        // 토큰과 닉네임을 쿠키에 저장
        setEncryptedCookie('trip-tune_at', accessToken, 5 / (24 * 60));
        setEncryptedCookie('trip-tune_rt', refreshToken, 7);
        setEncryptedCookie('nickname', nickname, 7);

        // 인증 상태 업데이트
        updateAuthStatus(true);

        // 이전 페이지로 리다이렉트 또는 홈으로 이동
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');

        // 잠시 대기 후 리다이렉트 (사용자가 로딩 화면을 볼 수 있도록)
        setTimeout(() => {
          router.push(redirectPath);
        }, 1000);
      } catch (error) {
        console.error('소셜 로그인 처리 중 오류 발생:', error);
        router.push('/Login');
      }
    };

    handleOAuthCallback();
  }, [router, setEncryptedCookie, updateAuthStatus]);

  return <VerificationLoading />;
}
