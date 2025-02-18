export interface UserData {
  userId: string;
  nickname: string;
  profileImage: string;
}

export interface FormData {
  nickname: string;
}

export interface AccountEmailFormData {
  email: string;
  verificationCode: string;
}

export interface AccountPasswordFormData {
  nowPassword: string;
  newPassword: string;
  rePassword: string;
}

export interface BookmarkPlace {
  placeId: number;
  country: string;
  city: string;
  district: string;
  placeName: string;
  thumbnailUrl: string;
  address: string;
  detailAddress: string;
}

export interface BookmarkResponse {
  totalPages: number;
  currentPage: number;
  totalElements: number;
  pageSize: number;
  content: BookmarkPlace[];
}
