// Common TypeScript Types
// Shared type definitions used across the application

// Pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// API Response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  pagination?: PaginationMeta;
}

// Query filters for search
export interface SearchFilters {
  sector?: string;
  stage?: string;
  location?: string;
  search?: string;
}
