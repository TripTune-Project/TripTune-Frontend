import axios from 'axios';
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
    const response = await axios.get<SuccessResponse>('/api/home');
    return response.data;
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

export const searchHomePlaces = async (
  params: SearchParams
): Promise<unknown> => {
  try {
    const queryParams = new URLSearchParams(convertToRecord(params)).toString();
    const response = await axios.get<SearchSuccessResponse | EmptyResultResponse>(
      `/api/home/search?${queryParams}`
    );
    return response.data;
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
