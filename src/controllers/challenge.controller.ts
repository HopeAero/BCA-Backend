import { RequestWithUser } from '@/interfaces/auth.interface';
import { Challenge } from '@/interfaces/challenges.interface';
import { PlayerChallenge } from '@/interfaces/playerChallenge.interface';
import { User } from '@/interfaces/users.interface';
import { ChallengeService } from '@/services/challenge.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class ChallengeController {
  public challenge = Container.get(ChallengeService);

  public getPlayerChallenges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challengeId = Number(req.params.challengeId);
      const findAllPlayerChallengesData: Challenge & { players: User[] } = await this.challenge.findChallengeWithPlayers(challengeId);

      res.status(200).json({ data: findAllPlayerChallengesData, message: 'findAll' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public getChallenges = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllChallengesData: Challenge[] = await this.challenge.findAllChallenge();

      res.status(200).json({ data: findAllChallengesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getChallengeById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challengeId = Number(req.params.id);
      const findOneChallengeData: Challenge = await this.challenge.findChallengeById(challengeId);

      res.status(200).json({ data: findOneChallengeData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createChallenge = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challengeData: Challenge = req.body;
      const user: User = req.user;
      const createChallengeData: Challenge = await this.challenge.createChallenge(challengeData, user);

      res.status(201).json({ data: createChallengeData, message: 'Challenge successfully created' });
    } catch (error) {
      next(error);
    }
  };

  public updateChallenge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challengeId = Number(req.params.id);
      const challengeData: Challenge = req.body;
      const updateChallengeData: Challenge = await this.challenge.updateChallenge(challengeId, challengeData);

      res.status(200).json({ data: updateChallengeData, message: 'Challenge successfully updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteChallenge = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const challengeId = Number(req.params.id);
      const deleteChallengeData: Challenge = await this.challenge.deleteChallenge(challengeId);

      res.status(200).json({ data: deleteChallengeData, message: 'Challenge successfully deleted' });
    } catch (error) {
      next(error);
    }
  };
}
