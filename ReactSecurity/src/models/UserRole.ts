import { Role } from "./Role";
import { User } from "./User";

export interface UserRole {
    id?: number;
    userId?: number;
    roleId?: number;
    user?: User | { id?: number; name?: string };
    role?: Role | { id?: number; name?: string };
    startAt?: string | Date | null;
    endAt?: string | Date | null;
}


