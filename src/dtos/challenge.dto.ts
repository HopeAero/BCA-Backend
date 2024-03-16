import { ChallengeCategory } from '@/constants/enum/challenges/category';
import { ChallengeDifficulty } from '@/constants/enum/challenges/difficulty';
import { ChallengeType } from '@/constants/enum/challenges/type';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateChallengeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public name: string;

  @IsString()
  @IsNotEmpty()
  public description: string;

  @IsNumber()
  @IsNotEmpty()
  public points: number;

  @IsEnum(ChallengeCategory)
  @IsNotEmpty()
  public category: string;

  @IsEnum(ChallengeDifficulty)
  @IsNotEmpty()
  public difficulty: string;

  @IsEnum(ChallengeType)
  @IsNotEmpty()
  public type: string;

  @IsNumber()
  @IsNotEmpty()
  public limitPlayers: number;

  @IsOptional()
  @IsBoolean()
  public isActivate: boolean;
}

export class UpdateChallengeDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  public name: string;

  @IsOptional()
  @IsString()
  public description: string;

  @IsOptional()
  @IsNumber()
  public points: number;

  @IsOptional()
  @IsEnum(ChallengeCategory)
  public category: string;

  @IsOptional()
  @IsEnum(ChallengeDifficulty)
  public difficulty: string;

  @IsOptional()
  @IsEnum(ChallengeType)
  public type: string;

  @IsOptional()
  @IsNumber()
  public limitPlayers: number;

  @IsOptional()
  @IsBoolean()
  public isActivate: boolean;
}
