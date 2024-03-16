import { UserRole } from '@/constants/enum/roles/roles';

export interface User {
  id?: number;
  username: string;
  points?: number;
  role?: UserRole;
  email: string;
  password: string;
}
