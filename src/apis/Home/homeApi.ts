import { get } from '@/apis/api';

// 인기 여행지
export const homePopularTravelList = async (
  city: string = "all",
  requiresAuth: boolean = false // 기본값 false
) => {
  try {
    return await get(
      `/api/travels/popular?city=${city}`,
      { requiresAuth } // 인증 필요 여부 전달
    );
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};

// 추천 테마 여행지
export const homeRecommendTravelList = async (
  theme: string = "all",
  requiresAuth: boolean = false // 기본값 false
) => {
  try {
    return await get(
      `/api/travels/recommend?theme=${theme}`,
      { requiresAuth } // 인증 필요 여부 전달
    );
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};
