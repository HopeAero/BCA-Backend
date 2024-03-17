import { ChallengeController } from '@/controllers/challenge.controller';
import { CreateChallengeDto } from '@/dtos/challenge.dto';
import { Routes } from '@/interfaces/routes.interface';
import { AdminMiddleware, AuthMiddleware } from '@/middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { Router } from 'express';

export class ChallengeRoute implements Routes {
  public path = '/challenges';
  public router = Router();
  public challenge = new ChallengeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/players/:challengeId`, AuthMiddleware, this.challenge.getPlayerChallenges);
    this.router.get(`${this.path}`, AuthMiddleware, this.challenge.getChallenges);
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.challenge.getChallengeById);
    this.router.post(`${this.path}`, AdminMiddleware, ValidationMiddleware(CreateChallengeDto), this.challenge.createChallenge);
    this.router.put(`${this.path}/:id`, AdminMiddleware, ValidationMiddleware(CreateChallengeDto), this.challenge.updateChallenge);
    this.router.delete(`${this.path}/:id`, AdminMiddleware, this.challenge.deleteChallenge);
  }
}
