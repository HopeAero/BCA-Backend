import { ChallengeCategory } from '@/constants/enum/challenges/category';
import { ChallengeDifficulty } from '@/constants/enum/challenges/difficulty';
import { ChallengeType } from '@/constants/enum/challenges/type';
import { Challenge } from '@/interfaces/challenges.interface';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './users.entity';

@Entity()
export class ChallengeEntity extends BaseEntity implements Challenge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  points: number;

  @Column({
    type: 'enum',
    enum: ChallengeCategory,
  })
  category: ChallengeCategory;

  @Column({
    type: 'enum',
    enum: ChallengeDifficulty,
    default: ChallengeDifficulty.EASY,
  })
  difficulty: ChallengeDifficulty;

  @Column({
    type: 'enum',
    enum: ChallengeType,
    default: ChallengeType.DIARY,
  })
  type: ChallengeType;

  @Column()
  limitPlayers: number;

  @Column('bool', { default: true })
  isActivate: boolean;

  @ManyToOne(() => UserEntity, user => user.challengesCreated)
  createdBy: UserEntity;
}
