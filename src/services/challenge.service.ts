import { Between, EntityRepository, Repository } from 'typeorm';
import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import { ChallengeEntity } from '@/entities/challenge.entity';
import { Challenge } from '@/interfaces/challenges.interface';
import { User } from '@/interfaces/users.interface';
import * as corn from 'node-cron';
import * as fns from 'date-fns';

@Service()
@EntityRepository()
export class ChallengeService extends Repository<ChallengeEntity> {
  constructor() {
    super();
    this.initializeCronJob();
  }

  public async initializeCronJob() {
    console.log('Running a task every 1 day');
    corn.schedule('0 0 * * *', async () => {
      console.log('Updating challenge availability');
      await this.updateChallengeAvailability();
    });

    console.log('Running a task every 1 week');
    corn.schedule('0 0 * * 1', async () => {
      console.log('Updating challenge availability');
      await this.updateChallengeAvailabilityWeekly();
    });

    console.log('Running a task every 1 month');
    corn.schedule('0 0 1 * *', async () => {
      console.log('Updating challenge availability');
      await this.updateChallengeAvailabilityMonthly();
    });

    console.log('Cron job initialized');
  }
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

  public async updateChallengeAvailability(): Promise<void> {
    // Obtén solo los desafíos de tipo "diario"
    const challenges = await ChallengeEntity.find({ where: { type: 'diary' } });

    // Actualiza el estado de cada desafío
    for (const challenge of challenges) {
      // Actualiza el estado del desafío en la base de datos
      await ChallengeEntity.update(challenge.id, { isActivate: false });
    }
  }

  public async updateChallengeAvailabilityWeekly(): Promise<void> {
    // Obtén solo los desafíos de tipo "semanal"
    const challenges = await ChallengeEntity.find({
      where: { type: 'weekly' },
    });

    // Actualiza el estado de cada desafío
    for (const challenge of challenges) {
      // Actualiza el estado del desafío en la base de datos
      await ChallengeEntity.update(challenge.id, { isActivate: false });
    }
  }

  public async updateChallengeAvailabilityMonthly(): Promise<void> {
    // Obtén solo los desafíos de tipo "mensual"
    const challenges = await ChallengeEntity.find({
      where: { type: 'monthly' },
    });

    // Actualiza el estado de cada desafío
    for (const challenge of challenges) {
      // Actualiza el estado del desafío en la base de datos
      await ChallengeEntity.update(challenge.id, { isActivate: false });
    }
  }

  public async deleteChallenge(challengeId: number): Promise<Challenge> {
    const findChallenge: Challenge = await ChallengeEntity.findOne({ where: { id: challengeId } });
    if (!findChallenge) throw new HttpException(409, "Challenge doesn't exist");

    await ChallengeEntity.delete({ id: challengeId });
    return findChallenge;
  }
}
