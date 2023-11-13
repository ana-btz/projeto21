import { notFoundError } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';

async function findTicketsTypes() {
    const types = await ticketsRepository.findTicketsTypes();
    return types;
}

async function findTicketByUserId(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

    if (!enrollment) throw notFoundError();

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

    if (!ticket) throw notFoundError();

    return ticket;
}

export const ticketsService = {
    findTicketsTypes,
    findTicketByUserId
};
