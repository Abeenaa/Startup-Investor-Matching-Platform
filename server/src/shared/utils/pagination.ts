// Pagination Utilities
// Helper functions for paginating database queries

/**
 * Calculate skip value for Prisma queries
 * @param page - Current page number (1-indexed)
 * @param limit - Items per page
 * @returns Number of items to skip
 */
export const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Parse pagination parameters from query string
 * @param page - Page number from query
 * @param limit - Limit from query
 * @returns Validated page and limit
 */
export const parsePaginationParams = (
  page?: string,
  limit?: string
): { page: number; limit: number } => {
  const parsedPage = parseInt(page || '1', 10);
  const parsedLimit = parseInt(limit || '10', 10);

  return {
    page: parsedPage > 0 ? parsedPage : 1,
    limit: parsedLimit > 0 && parsedLimit <= 100 ? parsedLimit : 10,
  };
};
