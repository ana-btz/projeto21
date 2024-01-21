import { Booking } from "@prisma/client";
import { notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories";

async function getBookingByUserId(userId: number) {
    const userBooking = await bookingRepository.findByUserId(userId);
    if (!userBooking) throw notFoundError();
    return userBooking;
}

async function createBooking(userId: number, roomId: number) {
    if (!roomId) throw notFoundError();

    return bookingRepository.create(userId, roomId);
}

export type CreateBookingParams = Pick<Booking, 'roomId'>;

export const bookingService = {
    getBookingByUserId,
    createBooking
};
