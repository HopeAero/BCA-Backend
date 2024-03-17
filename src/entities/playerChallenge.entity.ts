import { PlayerChallengeStatus } from '@/constants/enum/playerChallenges/status';
import { PlayerChallenge } from '@/interfaces/playerChallenge.interface';
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ChallengeEntity } from './challenge.entity';
import { UserEntity } from './users.entity';

@Entity()
export class PlayerChallengeEntity extends BaseEntity implements PlayerChallenge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: PlayerChallengeStatus,
  })
  status: PlayerChallengeStatus;

  @Column({ nullable: true })
  file: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserEntity, user => user.playerChallenges)
  player: UserEntity;

  @ManyToOne(() => ChallengeEntity, challenge => challenge.playerChallenges)
  challenge: ChallengeEntity;
}
