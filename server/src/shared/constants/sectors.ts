// Sector Constants
// Defines all business sectors for startups

export const SECTORS = [
  'Technology',
  'Agriculture',
  'Healthcare',
  'Education',
  'Finance',
  'E-commerce',
  'Manufacturing',
  'Energy',
  'Transportation',
  'Tourism',
  'Other',
] as const;

export type Sector = typeof SECTORS[number];
