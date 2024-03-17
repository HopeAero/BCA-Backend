import { hash } from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';
import { Service } from 'typedi';
import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';
import * as corn from 'node-cron';

@Service()
@EntityRepository()
export class UserService extends Repository<UserEntity> {
  constructor() {
    super();
    this.initializeCronJob();
  }

  public async initializeCronJob() {
    console.log('Running a ticket every 1 day');
    corn.schedule('0 0 * * *', async () => {
      console.log('Updating ticket diary availability');
      await this.giveDailyTicket();
    });

    console.log('Running a ticket every 1 week');
    corn.schedule('0 0 * * 1', async () => {
      console.log('Updating ticket weekly availability');
      await this.giveMonthlyTicket();
    });

    console.log('Running a ticket every 1 month');
    corn.schedule('0 0 1 * *', async () => {
      console.log('Updating challenge montly availability');
      await this.giveMonthlyTicket();
    });

    console.log('Cron job initialized');
  }
  public async findAllUser(): Promise<User[]> {
    const users: User[] = await UserEntity.find();
    return users;
  }

  public async rankingUser(): Promise<User[]> {
    const users: User[] = await UserEntity.find({
      select: ['id', 'username', 'points'],
      order: {
        points: 'DESC',
      },
    });
    return users;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async findUserMyData(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { id: userData.id } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await UserEntity.create({ ...userData, password: hashedPassword }).save();

    return createUserData;
  }

  public async updateUser(userId: number, userData: User): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    await UserEntity.update(userId, { ...userData, password: hashedPassword });

    const updateUser: User = await UserEntity.findOne({ where: { id: userId } });
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await UserEntity.findOne({ where: { id: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserEntity.delete({ id: userId });
    return findUser;
  }

  public async giveDailyTicket(): Promise<void> {
    // Get all users
    const users = await UserEntity.find();

    // Give each user a daily ticket
    for (const user of users) {
      user.ticketDiary += 1;
      await UserEntity.update(user.id, { ticketDiary: user.ticketDiary });
    }
  }

  public async giveWeeklyTicket(): Promise<void> {
    // Get all users
    const users = await UserEntity.find();

    // Give each user a weekly ticket
    for (const user of users) {
      user.ticketMonthly += 1;
      await UserEntity.update(user.id, { ticketWeekly: user.ticketWeekly });
    }
  }

  public async giveMonthlyTicket(): Promise<void> {
    // Get all users
    const users = await UserEntity.find();

    // Give each user a monthly ticket
    for (const user of users) {
      user.ticketMonthly += 1;
      await UserEntity.update(user.id, { ticketMonthly: user.ticketMonthly });
    }
  }
}
