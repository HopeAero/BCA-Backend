import { IsNotEmpty } from 'class-validator';
import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@interfaces/users.interface';
import { UserRole } from '@/constants/enum/roles/roles';

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
  points : number;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PLAYER,
  })
  role: UserRole;

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
}
