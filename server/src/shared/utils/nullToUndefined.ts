// Utility to convert null values to undefined for TypeScript compatibility
// Prisma returns null but TypeScript interfaces expect undefined

/**
 * Converts null values to undefined in an object
 */
export function nullToUndefined<T>(obj: T): T {
  if (obj === null) return undefined as T;
  if (typeof obj !== 'object' || obj === undefined) return obj;
  
  const result = { ...obj } as any;
  
  for (const key in result) {
    if (result[key] === null) {
      result[key] = undefined;
    }
  }
  
  return result;
}

/**
 * Converts null to undefined for a single value
 */
export function nullToUndef<T>(value: T | null): T | undefined {
  return value === null ? undefined : value;
}