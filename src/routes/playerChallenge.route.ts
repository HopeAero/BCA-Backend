import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AdminMiddleware, AuthMiddleware } from '@/middlewares/auth.middleware';
import { PlayerChallengeController } from '@/controllers/playerChallenge.controller';
import { CreatePlayerChallengeDto, UpdatePlayerChallengeDto } from '@/dtos/playerChallenge.dto';
import upload from '@/middlewares/multer.middleware';

export class PlayerChallengeRoute implements Routes {
  public path = '/playerChallenge';
  public router = Router();
  public playerChallenge = new PlayerChallengeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/setWinner/:challengeId/:playerId`,
      AdminMiddleware,
      ValidationMiddleware(UpdatePlayerChallengeDto),
      this.playerChallenge.winnerPlayerChallenge,
    );
    this.router.post(
      `${this.path}/participate`,
      AuthMiddleware,
      ValidationMiddleware(CreatePlayerChallengeDto),
      this.playerChallenge.createPlayerChallenge,
    );
    this.router.post(`${this.path}/seedResult/:challengeId`, AuthMiddleware, upload.single('result'), this.playerChallenge.seedResult);
    this.router.post(`${this.path}`, AuthMiddleware, ValidationMiddleware(CreatePlayerChallengeDto), this.playerChallenge.createPlayerChallenge);
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.playerChallenge.getPlayerChallengeById);
    this.router.put(`${this.path}/:id`, AuthMiddleware, ValidationMiddleware(UpdatePlayerChallengeDto), this.playerChallenge.updatePlayerChallenge);
    this.router.delete(`${this.path}/:id`, AdminMiddleware, this.playerChallenge.deletePlayerChallenge);
    this.router.get(`${this.path}`, AuthMiddleware, this.playerChallenge.getPlayerChallenges);
  }
}
