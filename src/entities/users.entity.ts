import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { UserRole } from '@/constants/enum/roles/roles';
import { ChallengeEntity } from './challenge.entity';
import { PlayerChallengeEntity } from './playerChallenge.entity';

@Entity()
export class UserEntity extends BaseEntity implements User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Unique(['username'])
  username: string;

  @Column({
    default: 0,
  })
  points: number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PLAYER,
  })
  role: UserRole;

  @Column({
    default: 1,
  })
  ticketDiary: number;

  @Column({
    default: 1,
  })
  ticketWeekly: number;

  @Column({
    default: 1,
  })
  ticketMonthly: number;

  @Column()
  @IsNotEmpty()
  @Unique(['email'])
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => ChallengeEntity, challenge => challenge.createdBy)
  challengesCreated: ChallengeEntity[];

  @OneToMany(() => PlayerChallengeEntity, playerChallenge => playerChallenge.player)
  playerChallenges: PlayerChallengeEntity[];
}
