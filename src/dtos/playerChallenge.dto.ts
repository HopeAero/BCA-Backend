import { PlayerChallengeStatus } from '@/constants/enum/playerChallenges/status';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePlayerChallengeDto {
  @IsNumber()
  @IsNotEmpty()
  public challengeId: number;

  @IsEnum(PlayerChallengeStatus)
  @IsNotEmpty()
  public status: PlayerChallengeStatus;

  @IsString()
  @IsOptional()
  file: string;
}

export class UpdatePlayerChallengeDto {
  @IsOptional()
  @IsEnum(PlayerChallengeStatus)
  public status: PlayerChallengeStatus;

  @IsOptional()
  @IsString()
  file: string;
}
