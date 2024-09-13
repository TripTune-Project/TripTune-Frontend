import axios, { AxiosResponse } from 'axios';

interface Place {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
  ThumbnailUrl: string;
}

interface SearchParams {
  type: string;
  keyword: string;
}

interface SearchResult {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
}

interface FetchSuccessResponse {
  success: true;
  data: {
    popularityList: Place[];
    domesticList: Place[];
    internationalList: Place[];
  };
  message: string;
}

interface SearchSuccessResponse {
  success: true;
  data: {
    totalPages: number;
    currentPage: number;
    totalCount: number;
    pageSize: number;
    searchList: SearchResult[];
  };
  message: string;
}

interface EmptyResultResponse {
  success: true;
  message: string;
}

interface ErrorResponse {
  success: false;
  errorCode: number;
  message: string;
}

type ApiResponse =
  | FetchSuccessResponse
  | SearchSuccessResponse
  | EmptyResultResponse
  | ErrorResponse;

export const fetchData = async (
  endpoint: string,
  params?: SearchParams
): Promise<ApiResponse> => {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.get(
      `http://13.209.177.247:8080/api/${endpoint}`,
      { params }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const response: AxiosResponse<ErrorResponse> = error.response;
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
