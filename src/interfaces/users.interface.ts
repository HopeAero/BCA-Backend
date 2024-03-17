import { UserRole } from '@/constants/enum/roles/roles';

export interface User {
  id?: number;
  username: string;
  points?: number;
  role?: UserRole;
  ticketDiary: number;
  ticketWeekly: number;
  ticketMonthly: number;
  email: string;
  password: string;
}
