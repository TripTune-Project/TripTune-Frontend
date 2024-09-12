import { get } from './api';
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

export const fetchTravelData = async (): Promise<
  SuccessResponse | ErrorResponse
> => {
  try {
    const data = await get<SuccessResponse>('/api/member/home');
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        errorCode: 500,
        message: '서버 내부 오류가 발생하였습니다.',
      };
    }
    return {
      success: false,
      errorCode: (error as any).errorCode || 500,
      message: (error as any).message || '알 수 없는 오류가 발생하였습니다.',
    };
  }
};

export const searchPlaces = async (
  params: SearchParams
): Promise<SearchSuccessResponse | EmptyResultResponse | ErrorResponse> => {
  try {
    const queryParams = new URLSearchParams(convertToRecord(params)).toString();
    const data = await get<SearchSuccessResponse | EmptyResultResponse>(
      `/api/home/search?${queryParams}`
    );
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        errorCode: 500,
        message: '서버 내부 오류가 발생하였습니다.',
      };
    }
    return {
      success: false,
      errorCode: (error as any).errorCode || 500,
      message: (error as any).message || '알 수 없는 오류가 발생하였습니다.',
    };
  }
};
