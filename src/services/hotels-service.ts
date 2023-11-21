import { TicketStatus } from "@prisma/client";
import { invalidDataError, notFoundError, paymentRequiredError } from "@/errors";
import { enrollmentRepository, hotelRepository, ticketsRepository } from "@/repositories";

async function validateRegistration(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    if (ticket.status === TicketStatus.RESERVED || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw paymentRequiredError();
    }
}

async function getHotels(userId: number) {
    await validateRegistration(userId);

    const hotels = await hotelRepository.findHotels();
    if (hotels.length === 0) throw notFoundError();

    return hotels;
}

async function getHotelWithRooms(userId: number, hotelId: number) {
    await validateRegistration(userId);

    if (isNaN(hotelId) || !hotelId) throw invalidDataError('hotelId');

    const hotelWithRooms = await hotelRepository.findHotelWithRoomsById(hotelId);
    if (!hotelWithRooms) throw notFoundError();

    return hotelWithRooms;
}

export const hotelsService = {
    getHotels,
    getHotelWithRooms
}