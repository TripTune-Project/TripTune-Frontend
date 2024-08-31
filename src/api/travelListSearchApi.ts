import { AxiosResponse } from 'axios';
import axiosInstance from './axiosInstance';

interface TravelListSearchParams {
  type: string;
  keyword: string;
}

interface TravelListSearchResult {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface TravelListSearchSuccessResponse {
  success: true;
  data: {
    totalPages: number;
    currentPage: number;
    totalElements: number;
    pageSize: number;
    content: TravelListSearchResult[];
  };
  message: string;
}

interface TravelListSearchEmptyResponse {
  success: true;
  message: string;
}

interface TravelListSearchErrorResponse {
  success: false;
  errorCode: number;
  message: string;
}

export const fetchTravelListSearch = async (
  params: TravelListSearchParams
): Promise<TravelListSearchSuccessResponse | TravelListSearchEmptyResponse | TravelListSearchErrorResponse> => {
  try {
    const response: AxiosResponse<TravelListSearchSuccessResponse | TravelListSearchEmptyResponse> = await axiosInstance.get(
      `/api/travels/search`,
      {
        params,
      }
    );
    return response.data;
  } catch (error) {
    if (axiosInstance.isAxiosError(error) && error.response) {
      const response: AxiosResponse<TravelListSearchErrorResponse> = error.response;
      console.error('API Error Response:', response.data);
      return response.data;
    } else {
      console.error('Unexpected Error:', error);
      return {
        success: false,
        errorCode: 500,
        message: '서버 내부 오류가 발생하였습니다.',
      };
    }
  }
};
