import axios, { AxiosResponse, AxiosError, isAxiosError } from 'axios';

interface TravelDetail {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
  address: string;
  description: string;
  imageList: { imageName: string; imageUrl: string }[];
  recommandedTravelList?: {
    country: string;
    city: string;
    district: string;
    placeName: string;
    ThumbnailUrl: string;
  }[];
}

interface TravelDetailSuccessResponse {
  success: true;
  data: TravelDetail;
  message: string;
}

interface TravelDetailErrorResponse {
  success: false;
  errorCode: number;
  message: string;
}

export const fetchTravelDetail = async (
  placeId: number
): Promise<TravelDetailSuccessResponse | TravelDetailErrorResponse> => {
  try {
    const response: AxiosResponse<TravelDetailSuccessResponse> = await axios.get(
      `/api/travels/${placeId}`
    );
    
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<TravelDetailErrorResponse>;
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
