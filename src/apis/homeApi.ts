import { get } from './Common/api';
import {
  EmptyResultResponse,
  ErrorResponse,
  SearchParams,
  SearchSuccessResponse,
  SuccessResponse,
} from '@/types/homeType';

const convertToRecord = (params: SearchParams): Record<string, string> => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    },
    {} as Record<string, string>
  );
};

export const fetchHomeData = async (): Promise<
  SuccessResponse | ErrorResponse
> => {
  try {
    return await get<SuccessResponse>('/home');
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};

export const searchHomePlaces = async (
  params: SearchParams
): Promise<SearchSuccessResponse | EmptyResultResponse | ErrorResponse> => {
  try {
    const queryParams = new URLSearchParams(convertToRecord(params)).toString();
    return await get<SearchSuccessResponse | EmptyResultResponse>(
      `/api/home/search?${queryParams}`
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
