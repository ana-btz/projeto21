import { prisma } from "@/config";

async function findByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: { userId },
    });
}

async function create(userId: number, roomId: number) {
    return prisma.booking.create({
        data: {
            userId,
            roomId,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
}

export const bookingRepository = {
    findByUserId,
    create
};