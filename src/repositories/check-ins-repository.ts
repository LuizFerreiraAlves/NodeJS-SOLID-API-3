import { CheckIn, Prisma } from "prisma/generated/prisma/client";

export interface CheckInsRepository {
    countByUserId(userId: string): Promise<number>

    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>

    findById(id: string): Promise<CheckIn | null>

    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>

    findManyByUserId(userId: string, page: number): Promise<CheckIn[]>

    save(checkIn: CheckIn): Promise<CheckIn>
}