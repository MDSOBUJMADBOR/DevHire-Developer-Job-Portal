export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface JwtPayload {
  userId: string;
  role: string;
}