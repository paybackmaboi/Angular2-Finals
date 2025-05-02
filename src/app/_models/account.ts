import { Role } from './role';

export interface Account {
    id: number;
    title?: string;
    firstName?: string;
    lastName?: string;
    email: string;
    role: Role;
    status?: string;
    jwtToken?: string;
    employeeId?: number;
}