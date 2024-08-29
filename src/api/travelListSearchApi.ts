import axios, { AxiosResponse } from 'axios';

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
    const response: AxiosResponse<TravelListSearchSuccessResponse | TravelListSearchEmptyResponse> = await axios.get(
      `/api/travels/search`,
      {
        params,
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const response: AxiosResponse<TravelListSearchErrorResponse> = error.response;
      return response.data;
    } else {
      return {
        success: false,
        errorCode: 500,
        message: '서버 내부 오류가 발생하였습니다.',
      };
    }
  }
};
