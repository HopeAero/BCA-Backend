import { PlayerChallengeStatus } from '@/constants/enum/playerChallenges/status';
import { Challenge } from './challenges.interface';
import { User } from './users.interface';

export interface PlayerChallenge {
  id?: number;
  challenge?: Challenge;
  player?: User;
  status: PlayerChallengeStatus;
  file?: string;
  createdAt: Date;
  updatedAt: Date;
}
