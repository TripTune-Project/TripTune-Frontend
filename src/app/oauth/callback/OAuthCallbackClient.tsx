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
        // URL 파라미터 전체 확인
        console.log('전체 URL 파라미터:', Object.fromEntries(searchParams.entries()));
        
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const nickname = searchParams.get('nickname');

        console.log('받은 토큰과 닉네임:', {
          accessToken: accessToken ? '있음' : '없음',
          refreshToken: refreshToken ? '있음' : '없음',
          nickname: nickname || '없음'
        });

        if (!accessToken || !refreshToken || !nickname) {
          console.error('필수 파라미터 누락:', {
            accessToken: !accessToken,
            refreshToken: !refreshToken,
            nickname: !nickname
          });
          throw new Error('소셜 로그인에 실패했습니다.');
        }

        // 토큰과 닉네임을 쿠키에 저장
        setEncryptedCookie('trip-tune_at', accessToken, 5 / (24 * 60));
        setEncryptedCookie('trip-tune_rt', refreshToken, 7);
        setEncryptedCookie('nickname', nickname, 7);

        console.log('쿠키 저장 완료');

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
