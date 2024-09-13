export interface Place {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
  ThumbnailUrl: string;
}

export interface SuccessResponse {
  success: true;
  data: {
    popularityList: Place[];
    domesticList: Place[];
    internationalList: Place[];
  };
  message: string;
}

export interface SearchParams {
  type: string;
  keyword: string;
}

export interface SearchResult {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
}

export interface SearchSuccessResponse {
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

export interface EmptyResultResponse {
  success: true;
  message: string;
}

export interface ErrorResponse {
  success: false;
  errorCode: number;
  message: string;
}
