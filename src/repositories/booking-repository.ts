import { prisma } from "@/config";

async function findByUserId(userId: number) {
    return prisma.booking.findFirst({
        where: { userId },
    });
}

export const bookingRepository = {
    findByUserId
};