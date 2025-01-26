import { getMyPage } from '@/apis/MyPage/myPageApi';
import { useQuery } from '@tanstack/react-query';

// 회원정보 조회
export const useMyPage = (
  requiresAuth: boolean = true,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['myPage', requiresAuth],
    queryFn: () => getMyPage(),
  });
};
