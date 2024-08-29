import axios, { AxiosResponse } from 'axios';

interface Place {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
  ThumbnailUrl: string;
}

interface SuccessResponse {
  success: true;
  data: {
    popularityList: Place[];
    domesticList: Place[];
    internationalList: Place[];
  };
  message: string;
}

interface ErrorResponse {
  success: false;
  errorCode: number;
  message: string;
}

export const fetchTravelData = async (): Promise<SuccessResponse | ErrorResponse> => {
  try {
    const response: AxiosResponse<SuccessResponse> = await axios.get(`/api/home`);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const response: AxiosResponse<ErrorResponse> = error.response;
      return response.data;
    } else {
      return {
        success: false,
        errorCode: 500,
        message: '서버 내부 오류가 발생하였습니다.'
      };
    }
  }
};
