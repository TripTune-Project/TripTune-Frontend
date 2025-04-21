'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import saveLocalContent from '@/utils/saveLocalContent';
import useAuth from '@/hooks/useAuth';
import VerificationLoading from '@/components/Common/VerificationLoading';

export default function OAuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setEncryptedCookie } = saveLocalContent();
  const { updateAuthStatus } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const accessToken = searchParams.get('accessToken');
        const nickname = searchParams.get('nickname');

        if (!accessToken || !nickname) {
          throw new Error('소셜 로그인에 실패했습니다.');
        }

        // 토큰과 닉네임을 쿠키에 저장
        setEncryptedCookie('trip-tune_at', accessToken, 5 / (24 * 60));
        setEncryptedCookie('nickname', nickname, 7);

        // 인증 상태 업데이트
        updateAuthStatus(true);

        // 이전 페이지로 리다이렉트 또는 홈으로 이동
        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } catch (error) {
        console.error('소셜 로그인 처리 중 오류 발생:', error);
        router.push('/Login');
      }
    };

    handleOAuthCallback();
  }, [router, searchParams, setEncryptedCookie, updateAuthStatus]);

  return <VerificationLoading />;
}
