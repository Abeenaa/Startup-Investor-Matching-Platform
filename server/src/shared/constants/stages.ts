// Stage Constants
// Defines all startup development stages

export const STAGES = [
  'Idea',
  'Prototype',
  'MVP',
  'Seed',
  'Early Growth',
  'Growth',
  'Expansion',
  'Mature',
] as const;

export type Stage = typeof STAGES[number];
