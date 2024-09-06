import axios, { AxiosResponse } from 'axios';

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

interface SuccessResponse {
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

export const searchPlaces = async (
  params: SearchParams
): Promise<SuccessResponse | EmptyResultResponse | ErrorResponse> => {
  try {
    const response: AxiosResponse<SuccessResponse | EmptyResultResponse> =
      await axios.get(`/api/home/search`, {
        params,
      });

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
