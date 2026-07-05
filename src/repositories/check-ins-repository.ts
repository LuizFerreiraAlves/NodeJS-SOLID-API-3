import { CheckIn, Prisma } from "prisma/generated/prisma/client";

export interface CheckInsRepository {
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}