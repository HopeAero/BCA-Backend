import { POSTGRES_HOST } from '@/config';
import { PlayerChallengeStatus } from '@/constants/enum/playerChallenges/status';
import { UpdateChallengeDto } from '@/dtos/challenge.dto';
import { CreatePlayerChallengeDto } from '@/dtos/playerChallenge.dto';
import { ChallengeEntity } from '@/entities/challenge.entity';
import { PlayerChallengeEntity } from '@/entities/playerChallenge.entity';
import { UserEntity } from '@/entities/users.entity';
import { HttpException } from '@/exceptions/httpException';
import { Challenge } from '@/interfaces/challenges.interface';
import { PlayerChallenge } from '@/interfaces/playerChallenge.interface';
import { User } from '@/interfaces/users.interface';
import { Request } from 'express';
import { Service } from 'typedi';
import { EntityRepository, Equal, Not, Repository } from 'typeorm';

@Service()
@EntityRepository()
export class PlayerChallengeService extends Repository<PlayerChallengeEntity> {
  public async findAllPlayerChallenge(): Promise<PlayerChallenge[]> {
    const playerChallenges: PlayerChallenge[] = await PlayerChallengeEntity.createQueryBuilder('playerChallenge')
      .leftJoinAndSelect('playerChallenge.challenge', 'challenge')
      .leftJoinAndSelect('playerChallenge.player', 'player')
      .select([
        'playerChallenge',
        'challenge.id',
        'challenge.name',
        'challenge.description',
        'challenge.points',
        'challenge.category',
        'challenge.difficulty',
        'challenge.type',
        'challenge.limitPlayers',
        'challenge.isActivate',
        'player.id',
        'player.username',
        'player.role',
        'player.points',
        'player.ticketDiary',
        'player.ticketWeekly',
        'player.ticketMonthly',
      ])
      .where('playerChallenge.deletedAt IS NULL')
      .getMany();
    return playerChallenges;
  }

  public async findPlayerChallengeById(playerChallengeId: number): Promise<PlayerChallenge> {
    const findPlayerChallenge: PlayerChallenge = await PlayerChallengeEntity.createQueryBuilder('playerChallenge')
      .leftJoinAndSelect('playerChallenge.challenge', 'challenge')
      .leftJoinAndSelect('playerChallenge.player', 'player')
      .select([
        'playerChallenge',
        'challenge.id',
        'challenge.name',
        'challenge.description',
        'challenge.points',
        'challenge.category',
        'challenge.difficulty',
        'challenge.type',
        'challenge.limitPlayers',
        'challenge.isActivate',
        'player.id',
        'player.username',
        'player.role',
        'player.points',
        'player.ticketDiary',
        'player.ticketWeekly',
        'player.ticketMonthly',
      ])
      .where('playerChallenge.id = :id AND playerChallenge.deletedAt IS NULL', { id: playerChallengeId })
      .getOne();

    if (!findPlayerChallenge) throw new HttpException(409, "PlayerChallenge doesn't exist");

    return findPlayerChallenge;
  }

  public async createPlayerChallenge(playerChallengeData: CreatePlayerChallengeDto, userData: User, challengeData: Challenge): Promise<void> {
    if (challengeData.limitPlayers === 0) throw new HttpException(409, "Challenge doesn't have any more slots");

    if (userData.ticketDiary === 0 && challengeData.type === 'diary')
      throw new HttpException(409, "You don't have any more tickets for this challenge");

    if (userData.ticketWeekly === 0 && challengeData.type === 'weekly')
      throw new HttpException(409, "You don't have any more tickets for this challenge");

    if (userData.ticketMonthly === 0 && challengeData.type === 'monthly')
      throw new HttpException(409, "You don't have any more tickets for this challenge");

    if (challengeData.createdBy.id === userData.id) throw new HttpException(409, "You can't join your own challenge");

    if (challengeData.isActivate === false) throw new HttpException(409, 'Challenge is not available');

    const findPlayerChallenge: PlayerChallenge = await PlayerChallengeEntity.findOne({ where: { player: userData, challenge: challengeData } });

    if (findPlayerChallenge) throw new HttpException(409, 'You are already in this challenge');

    await PlayerChallengeEntity.create({
      ...playerChallengeData,
      player: userData,
      challenge: challengeData,
    }).save();

    const findUser = await UserEntity.findOne({ where: { id: userData.id } });

    if (challengeData.type === 'diary') {
      await UserEntity.update(userData.id, { ...userData, ticketDiary: findUser.ticketDiary - 1 });
    }

    if (challengeData.type === 'weekly') {
      await UserEntity.update(userData.id, { ...userData, ticketWeekly: findUser.ticketWeekly - 1 });
    }

    if (challengeData.type === 'monthly') {
      await UserEntity.update(userData.id, { ...userData, ticketMonthly: findUser.ticketMonthly - 1 });
    }

    await ChallengeEntity.update(challengeData.id, { ...challengeData, limitPlayers: challengeData.limitPlayers - 1 });

    return;
  }

  public async updatePlayerChallenge(playerChallengeId: number, playerChallengeData: PlayerChallenge): Promise<PlayerChallenge> {
    const findPlayerChallenge: PlayerChallenge = await PlayerChallengeEntity.findOne({ where: { id: playerChallengeId } });
    if (!findPlayerChallenge) throw new HttpException(409, "PlayerChallenge doesn't exist");

    await PlayerChallengeEntity.update(playerChallengeId, playerChallengeData);

    const updatePlayerChallenge: PlayerChallenge = await PlayerChallengeEntity.findOne({ where: { id: playerChallengeId } });
    return updatePlayerChallenge;
  }

  public async winnerPlayerChallenge(challengeId: number, playerChallengeData: PlayerChallenge, playerId: number): Promise<void> {
    const findChallenge = await ChallengeEntity.findOne({ where: { id: challengeId } });
    if (!findChallenge) throw new HttpException(409, "Challenge doesn't exist");

    const userData = await UserEntity.findOne({ where: { id: playerId } });
    if (!userData) throw new HttpException(409, "User doesn't exist");

    if (findChallenge.isActivate === false) throw new HttpException(409, 'Challenge is not available');

    const findPlayerChallenge: PlayerChallenge = await PlayerChallengeEntity.findOne({ where: { challenge: findChallenge, player: userData } });

    if (!findPlayerChallenge) throw new HttpException(409, "PlayerChallenge doesn't exist");

    if (findPlayerChallenge.status === 'winner') throw new HttpException(409, 'PlayerChallenge already has a winner');

    await PlayerChallengeEntity.update(findPlayerChallenge.id, { ...playerChallengeData, status: PlayerChallengeStatus.WINNER });
    const otherPlayerChallenges: PlayerChallenge[] = await PlayerChallengeEntity.find({
      where: { challenge: findChallenge, player: Not(Equal(userData.id)) },
    });
    for (const pc of otherPlayerChallenges) {
      await PlayerChallengeEntity.update(pc.id, { ...pc, status: PlayerChallengeStatus.LOSER });
    }

    await ChallengeEntity.update(challengeId, { ...findChallenge, isActivate: false });

    await UserEntity.update(userData.id, { points: userData.points + findChallenge.points });
    return;
  }

  public async deletePlayerChallenge(playerChallengeId: number): Promise<PlayerChallenge> {
    const findPlayerChallenge: PlayerChallenge = await PlayerChallengeEntity.findOne({ where: { id: playerChallengeId } });
    if (!findPlayerChallenge) throw new HttpException(409, "PlayerChallenge doesn't exist");

    await PlayerChallengeEntity.delete({ id: playerChallengeId });
    return findPlayerChallenge;
  }
}
