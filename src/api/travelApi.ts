import { post, get } from './api';
import {
  TravelDetailSuccessResponse,
  TravelListSearchParams,
  TravelListSearchSuccessResponse,
  TravelApiResponse,
  TravelApiErrorResponse,
  TravelApiEmptyResponse,
} from '@/types/travelType';
import { Coordinates } from '@/types';

export const fetchTravelListByLocation = async (
  params: Coordinates,
  page: number = 1
): Promise<
  TravelApiResponse | TravelApiEmptyResponse | TravelApiErrorResponse
> => {
  try {
    const pageNum = Number(page);
    const data = await post<TravelApiResponse>(
      `/travels/list?page=${pageNum}`,
      params
    );
    if (!data.data || data.data.content.length === 0) {
      return {
        success: true,
        message: '검색 결과가 존재하지 않습니다.',
      };
    }
    return data;
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};

export const fetchTravelListSearch = async (
  params: TravelListSearchParams,
  page: number = 1
): Promise<
  | TravelListSearchSuccessResponse
  | TravelApiEmptyResponse
  | TravelApiErrorResponse
> => {
  try {
    const pageNum = Number(page);
    const data = await post<TravelListSearchSuccessResponse>(
      `/travels/search?page=${pageNum}`,
      params
    );
    if (!data.data || data.data.content.length === 0) {
      return {
        success: true,
        message: '검색 결과가 존재하지 않습니다.',
      };
    }
    return data;
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};

export const fetchTravelDetail = async (
  placeId: number
): Promise<TravelDetailSuccessResponse | TravelApiErrorResponse> => {
  try {
    const data = await get<TravelDetailSuccessResponse>(`/travels/${placeId}`);
    return data;
  } catch (error) {
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};
