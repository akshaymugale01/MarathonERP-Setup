export type FileListType = FileList;

export interface BaseResponse {
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends BaseResponse {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role?: {
    id: number;
    name: string;
    display_name: string;
    permissions_hash: string;
  };
  department?: string;
}

export interface AuthResponse extends BaseResponse {
  user?: User;
  spree_api_key?: string;
}
