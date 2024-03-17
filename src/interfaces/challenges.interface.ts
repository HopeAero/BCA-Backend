import { ChallengeCategory } from '@/constants/enum/challenges/category';
import { ChallengeDifficulty } from '@/constants/enum/challenges/difficulty';
import { ChallengeType } from '@/constants/enum/challenges/type';
import { User } from './users.interface';

export interface Challenge {
  id?: number;
  createdBy?: User;
  name: string;
  description: string;
  points: number;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  type: ChallengeType;
  limitPlayers: number;
  isActivate?: boolean;
}
