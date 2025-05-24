import type { TravelPlace, TravelPlaceDetail, TravelListSearchParams, TravelApiResponse, TravelListSearchSuccessResponse, TravelDetailSuccessResponse, TravelApiEmptyResponse, TravelApiErrorResponse } from '@/types/travelType';

export type Travel = TravelPlace | TravelPlaceDetail;

// 테스트용 Travel 타입
export interface TestTravel {
  id: number;
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
  distance: number;
  bookmarkStatus?: boolean;
}

export type {
  TravelPlace,
  TravelPlaceDetail,
  TravelListSearchParams,
  TravelApiResponse,
  TravelListSearchSuccessResponse,
  TravelDetailSuccessResponse,
  TravelApiEmptyResponse,
  TravelApiErrorResponse
}; 