import { User, LeaderboardEntry } from './types';

export const currentUser: User = {
  id: '1',
  name: 'Dr. João Silva',
  email: 'joao.silva@example.com',
  points: 1250,
  reportsGenerated: 25,
};

export const leaderboardData: LeaderboardEntry[] = [
  { name: 'Dr. Maria Santos', points: 1500, reportsGenerated: 30 },
  { name: 'Dr. João Silva', points: 1250, reportsGenerated: 25 },
  { name: 'Dr. Ana Oliveira', points: 1100, reportsGenerated: 22 },
  { name: 'Dr. Carlos Ferreira', points: 950, reportsGenerated: 19 },
  { name: 'Dr. Beatriz Costa', points: 800, reportsGenerated: 16 },
];

