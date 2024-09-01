import { AxiosResponse, AxiosError, isAxiosError } from 'axios';
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
  detailAddress: string;
  thumbnailUrl: string;
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
  params: TravelListSearchParams,
  page: number = 1
): Promise<TravelListSearchSuccessResponse | TravelListSearchEmptyResponse | TravelListSearchErrorResponse> => {
  try {
    const pageNum = Number(page);
    
    const response: AxiosResponse<TravelListSearchSuccessResponse | TravelListSearchEmptyResponse> = await axiosInstance.get(
      `/api/travels/search?page=${pageNum}`,
      {
        params,
      }
    );
    
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<TravelListSearchErrorResponse>;
      if (axiosError.response) {
        console.error('API Error Response:', axiosError.response.data);
        return axiosError.response.data;
      }
    }
    
    console.error('Unexpected Error:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};
