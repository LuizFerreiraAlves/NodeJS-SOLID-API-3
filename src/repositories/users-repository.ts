import { Prisma, User } from "prisma/generated/prisma/client";

export interface UsersRepository {    
    create(data: Prisma.UserCreateInput): Promise<User>

    findByEmail(email: string): Promise<User | null>
}