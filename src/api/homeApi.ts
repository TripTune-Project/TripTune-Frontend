import { get } from './api';
import {
  EmptyResultResponse,
  ErrorResponse,
  SearchParams,
  SearchSuccessResponse,
  SuccessResponse,
} from '@/types/homeType';

export const fetchTravelData = async (): Promise<
  SuccessResponse | ErrorResponse
> => {
  try {
    const data = await get<SuccessResponse>('/home');
    return data;
  } catch (error) {
    return {
      success: false,
      errorCode: error instanceof Error ? 500 : error.errorCode,
      message: error instanceof Error ? '서버 내부 오류가 발생하였습니다.' : error.message,
    };
  }
};

export const searchPlaces = async (
  params: SearchParams
): Promise<SearchSuccessResponse | EmptyResultResponse | ErrorResponse> => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const data = await get<SearchSuccessResponse | EmptyResultResponse>(
      `/home/search?${queryParams}`
    );
    return data;
  } catch (error) {
    return {
      success: false,
      errorCode: error instanceof Error ? 500 : error.errorCode,
      message: error instanceof Error ? '서버 내부 오류가 발생하였습니다.' : error.message,
    };
  }
};
