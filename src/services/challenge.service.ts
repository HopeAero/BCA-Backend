import { EntityRepository, Repository } from 'typeorm';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { ChallengeEntity } from '@/entities/challenge.entity';
import { Challenge } from '@/interfaces/challenges.interface';
import { User } from '@/interfaces/users.interface';

@Service()
@EntityRepository()
export class ChallengeService extends Repository<ChallengeEntity> {
  public async findAllChallenge(): Promise<Challenge[]> {
    const challenges: Challenge[] = await ChallengeEntity.find();
    return challenges;
  }

  public async findChallengeById(challengeId: number): Promise<Challenge> {
    const findChallenge: Challenge = await ChallengeEntity.findOne({ where: { id: challengeId } });
    if (!findChallenge) throw new HttpException(409, "Challenge doesn't exist");

    return findChallenge;
  }

  public async createChallenge(challengeData: Challenge, userData: User): Promise<Challenge> {
    const createChallengeData: Challenge = await ChallengeEntity.create({ ...challengeData, createdBy: userData }).save();
    return createChallengeData;
  }

  public async updateChallenge(challengeId: number, challengeData: Challenge): Promise<Challenge> {
    const findChallenge: Challenge = await ChallengeEntity.findOne({ where: { id: challengeId } });
    if (!findChallenge) throw new HttpException(409, "Challenge doesn't exist");

    await ChallengeEntity.update(challengeId, challengeData);

    const updateChallenge: Challenge = await ChallengeEntity.findOne({ where: { id: challengeId } });
    return updateChallenge;
  }

  public async deleteChallenge(challengeId: number): Promise<Challenge> {
    const findChallenge: Challenge = await ChallengeEntity.findOne({ where: { id: challengeId } });
    if (!findChallenge) throw new HttpException(409, "Challenge doesn't exist");

    await ChallengeEntity.delete({ id: challengeId });
    return findChallenge;
  }
}
