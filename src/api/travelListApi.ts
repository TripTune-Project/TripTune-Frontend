import axios, { AxiosResponse, AxiosError, isAxiosError } from 'axios';

interface TravelListLocationParams {
  longitude: number;
  latitude: number;
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
  detailAddress: string;
  thumbnailUrl: string;
  distance:string;
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

export const fetchTravelListByLocation = async (
  params: TravelListLocationParams,
  page: number = 1
): Promise<TravelListSuccessResponse | TravelListEmptyResponse | TravelListErrorResponse> => {
  try {
    const pageNum = Number(page);
    
    const response: AxiosResponse<TravelListSuccessResponse | TravelListEmptyResponse> = await axios.post(
      `/api/travels/list?page=${pageNum}`,
        params,
    );
    
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<TravelListErrorResponse>;
      const response = axiosError.response;
      
      if (response) {
        console.error('API 오류 응답:', response.data);
        return response.data;
      }
    }
    
    console.error('예기치 않은 오류:', error);
    return {
      success: false,
      errorCode: 500,
      message: '서버 내부 오류가 발생하였습니다.',
    };
  }
};
