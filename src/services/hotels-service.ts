import { TicketStatus } from "@prisma/client";
import { cannotListHotelsError, invalidDataError, notFoundError } from "@/errors";
import { enrollmentRepository, hotelRepository, ticketsRepository } from "@/repositories";

async function getHotels(userId: number) {
    await validateUserBooking(userId);

    const hotels = await hotelRepository.findHotels();
    if (hotels.length === 0) throw notFoundError();

    return hotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
    await validateUserBooking(userId);

    if (!hotelId || isNaN(hotelId)) throw invalidDataError('hotelId');

    const hotelWithRooms = await hotelRepository.findRoomsByHotelId(hotelId);
    if (!hotelWithRooms) throw notFoundError();

    return hotelWithRooms;
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
    getHotels,
    getHotelsWithRooms
};