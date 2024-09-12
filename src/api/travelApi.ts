import { post, get } from './api';
import {
  TravelDetailSuccessResponse,
  TravelListSearchParams,
  TravelListSearchSuccessResponse,
  TravelApiResponse,
  TravelApiErrorResponse,
} from '@/types/travelType';
import { Coordinates } from '@/types';

export const fetchTravelListByLocation = async (
  params: Coordinates,
  page: number = 1,
): Promise<TravelApiResponse | TravelApiErrorResponse> => {
  try {
    const pageNum = Number(page);
    const data = await post<TravelApiResponse>(`/travels/list?page=${pageNum}`, params);
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
  page: number = 1,
): Promise<TravelListSearchSuccessResponse | TravelApiErrorResponse> => {
  try {
    const pageNum = Number(page);
    const data = await post<TravelListSearchSuccessResponse>(
      `/travels/search?page=${pageNum}`,
      params
    );
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
  placeId: number,
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
