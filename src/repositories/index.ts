export * from './address-repository';
export * from './authentication-repository';
export * from './enrollments-repository';
export * from './events-repository';
export * from './users-repository';
export * from './tickets-repository';
export * from './payments-repository';
export * from './hotels-repository';
export * from './booking-repositry';
import { prisma } from '@/config';

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
  create,
};
