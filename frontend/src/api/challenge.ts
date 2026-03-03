import request from '@/api/request';
import type { Challenge } from '@/types/challenge';

export interface ChallengeListParams {
  category?: string;
  difficulty?: string;
  search?: string;
}

export interface ChallengeListResponse {
  items: Challenge[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
}

/**
 * Get challenge list with optional filters
 */
export async function getChallenges(params?: ChallengeListParams): Promise<ChallengeListResponse> {
  return request.get('/challenges', { params });
}

/**
 * Get single challenge by ID
 */
export async function getChallenge(id: number): Promise<Challenge> {
  return request.get(`/challenges/${id}`);
}

/**
 * Get challenges by category
 */
export async function getChallengesByCategory(): Promise<unknown> {
  return request.get('/challenges/categories');
}

/**
 * Search challenges
 */
export async function searchChallenges(query: string): Promise<Challenge[]> {
  return request.get('/challenges/search', { params: { q: query } });
}
