import { notFoundError } from "@/errors";
import { enrollmentRepository, ticketsRepository } from "@/repositories";

async function getTicketTypes() {
    const ticketTypes = await ticketsRepository.findTicketTypes();
    return ticketTypes;
}

async function getTicketByUserId(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    return ticket;
}

export const ticketsService = {
    getTicketTypes,
    getTicketByUserId
};