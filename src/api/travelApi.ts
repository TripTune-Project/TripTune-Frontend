import axios, { AxiosResponse, AxiosError, isAxiosError } from 'axios';
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
  page: number = 1
): Promise<TravelApiResponse | TravelApiErrorResponse> => {
  try {
    const pageNum = Number(page);

    const response: AxiosResponse<TravelApiResponse> = await axios.post(
      `/api/travels/list?page=${pageNum}`,
      params
    );

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<TravelApiErrorResponse>;
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

export const fetchTravelListSearch = async (
  params: TravelListSearchParams,
  page: number = 1
): Promise<TravelListSearchSuccessResponse | TravelApiErrorResponse> => {
  try {
    const pageNum = Number(page);

    const response: AxiosResponse<TravelListSearchSuccessResponse> =
      await axios.post(`/api/travels/search?page=${pageNum}`,
        params);

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<TravelApiErrorResponse>;
      if (axiosError.response) {
        console.error('API 오류 응답:', axiosError.response.data);
        return axiosError.response.data;
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

export const fetchTravelDetail = async (
  placeId: number
): Promise<TravelDetailSuccessResponse | TravelApiErrorResponse> => {
  try {
    const response: AxiosResponse<TravelDetailSuccessResponse> =
      await axios.get(`/api/travels/${placeId}`);

    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<TravelApiErrorResponse>;
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
