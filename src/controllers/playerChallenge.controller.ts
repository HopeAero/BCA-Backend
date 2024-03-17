import { PlayerChallenge } from '@/interfaces/playerChallenge.interface';
import { PlayerChallengeService } from '@/services/playerChallenge.service';
import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { Container } from 'typedi';
import { ChallengeEntity } from '@/entities/challenge.entity';
import { User } from '@/interfaces/users.interface';
import { CreateChallengeDto } from '@/dtos/challenge.dto';
import { CreatePlayerChallengeDto } from '@/dtos/playerChallenge.dto';
export class PlayerChallengeController {
  public playerChallenge = Container.get(PlayerChallengeService);

  public getPlayerChallenges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllPlayerChallengesData: PlayerChallenge[] = await this.playerChallenge.findAllPlayerChallenge();

      res.status(200).json({ data: findAllPlayerChallengesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getPlayerChallengeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerChallengeId = Number(req.params.id);
      const findOnePlayerChallengeData: PlayerChallenge = await this.playerChallenge.findPlayerChallengeById(playerChallengeId);

      res.status(200).json({ data: findOnePlayerChallengeData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createPlayerChallenge = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerChallengeData: CreatePlayerChallengeDto = req.body;

      const findChallenge = await ChallengeEntity.createQueryBuilder('challenge')
        .leftJoinAndSelect('challenge.createdBy', 'createdBy')
        .select([
          'challenge',
          'createdBy.id',
          'createdBy.username',
          'createdBy.role',
          'createdBy.points',
          'createdBy.ticketDiary',
          'createdBy.ticketWeekly',
          'createdBy.ticketMonthly',
        ])
        .where('challenge.id = :id', { id: playerChallengeData.challengeId })
        .getOne();

      if (!findChallenge) {
        res.status(404).json({ message: 'Challenge not found' });
        return;
      }

      const user: User = req.user;

      await this.playerChallenge.createPlayerChallenge(playerChallengeData, user, findChallenge);

      res.status(201).json({ message: 'PlayerChallenge successfully created' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public updatePlayerChallenge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerChallengeId = Number(req.params.id);
      const playerChallengeData: PlayerChallenge = req.body;

      const updatePlayerChallengeData: PlayerChallenge = await this.playerChallenge.updatePlayerChallenge(playerChallengeId, playerChallengeData);

      res.status(200).json({ data: updatePlayerChallengeData, message: 'update' });
    } catch (error) {
      next(error);
    }
  };

  public winnerPlayerChallenge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challengeId = Number(req.params.challengeId);
      const playerId = Number(req.params.playerId);
      const playerChallengeData: PlayerChallenge = req.body;

      await this.playerChallenge.winnerPlayerChallenge(challengeId, playerChallengeData, playerId);

      res.status(200).json({ message: 'PlayerChallenge winner successfully updated' });
    } catch (error) {
      next(error);
    }
  };

  public deletePlayerChallenge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const playerChallengeId = Number(req.params.id);
      const deletePlayerChallengeData: PlayerChallenge = await this.playerChallenge.deletePlayerChallenge(playerChallengeId);

      res.status(200).json({ data: deletePlayerChallengeData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
