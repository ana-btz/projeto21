import { notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories";

async function getBookingByUserId(userId: number) {
    const userBooking = await bookingRepository.findByUserId(userId);
    if (!userBooking) throw notFoundError();
    return userBooking;
}

export const bookingService = {
    getBookingByUserId
};

