export interface CreateAccountRequest {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
}

export interface CreateAccountResponse {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
  userId: number;
}

export interface GetUserResponse {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userId: number;
}

export interface GetUserRequest {
  id: number;
}

export interface UserResponse {}

export interface User {
  test: string;
}

export interface Test {
  test: string;
  pageParam: string | number | unknown;
  token: string;
}
