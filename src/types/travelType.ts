export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errorCode?: number;
}

export interface PaginatedResponse<T> {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  content: T[];
}

export interface TravelPlace {
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
}

export interface TravelPlaceDetail extends TravelPlace {
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

export interface TravelListSearchParams {
  keyword: string;
}

export type TravelApiResponse = ApiResponse<PaginatedResponse<TravelPlace>>;
export type TravelListSearchSuccessResponse = ApiResponse<PaginatedResponse<TravelPlace>>;
export type TravelDetailSuccessResponse = ApiResponse<TravelPlaceDetail>;

export interface TravelApiEmptyResponse extends ApiResponse<null> {
  success: true;
  message: string;
}

export interface TravelApiErrorResponse extends ApiResponse<null> {
  success: false;
  errorCode: number;
  message: string;
}
