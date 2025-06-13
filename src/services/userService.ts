// src/services/userService.ts
import axiosInstance from "../lib/axios";
import type { User } from "../types/user";

// Params for paginated API
export interface FetchUserParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Expected structure for paginated response
export interface PaginatedUserResponse {
  users: User[];
  total_count: number;
  total_pages: number;
  current_page: number;
}

// 1. For List Page
// export async function getUsers(params: FetchUserParams): Promise<PaginatedUserResponse> {
//   const response = await axiosInstance.get("/users.json", { params });
//   console.log("User API Response:", response.data);
//   return response.data;
// }

export async function getUsers(params: FetchUserParams) : Promise<PaginatedUserResponse> {
    const {search, ...rest} = params;
    const rasackQuery = search ? {'q[firstname_or_lastname_or_email_or_mobile_cont]': search} : {};

    const response = await axiosInstance.get("/users.json", {
        params: {...rest, ...rasackQuery},
    });
    console.log("User API Response", response);
    return response.data
}


// 2. For Detail/Edit Page
export async function getUserById(id: number): Promise<User> {
  const response = await axiosInstance.get(`/users/${id}.json`);
  return response.data;
}
