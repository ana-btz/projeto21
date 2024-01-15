import { cannotListHotelsError, notFoundError } from "@/errors";
import { TicketStatus } from "@prisma/client";
import { enrollmentRepository, hotelRepository, ticketsRepository } from "@/repositories";

async function getHotels(userId: number) {
    await validateUserBooking(userId);

    const hotels = await hotelRepository.findHotels();
    if (hotels.length === 0) throw notFoundError();

    return hotels;
}

async function validateUserBooking(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const type = ticket.TicketType;

    if (ticket.status === TicketStatus.RESERVED || type.isRemote || !type.includesHotel) {
        throw cannotListHotelsError();
    }
}

export const hotelsService = {
    getHotels
};