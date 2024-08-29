import axios, { AxiosResponse } from 'axios';

interface TravelListParams {
  type: string;
  keyword: string;
}

interface TravelListResult {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface TravelListSuccessResponse {
  success: true;
  data: {
    totalPages: number;
    currentPage: number;
    totalElements: number;
    pageSize: number;
    content: TravelListResult[];
  };
  message: string;
}

interface TravelListEmptyResponse {
  success: true;
  message: string;
}

interface TravelListErrorResponse {
  success: false;
  errorCode: number;
  message: string;
}

export const fetchTravelList = async (
  params: TravelListParams
): Promise<TravelListSuccessResponse | TravelListEmptyResponse | TravelListErrorResponse> => {
  try {
    const response: AxiosResponse<TravelListSuccessResponse | TravelListEmptyResponse> = await axios.get(
      `/api/travels/search`,
      {
        params,
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const response: AxiosResponse<TravelListErrorResponse> = error.response;
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
