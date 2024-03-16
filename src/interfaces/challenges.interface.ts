import { ChallengeCategory } from '@/constants/enum/challenges/category';
import { ChallengeDifficulty } from '@/constants/enum/challenges/difficulty';
import { ChallengeType } from '@/constants/enum/challenges/type';

export interface Challenge {
  id?: number;
  userId?: number;
  name: string;
  description: string;
  points: number;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  type: ChallengeType;
  limitPlayers: number;
  isActivate?: boolean;
}
