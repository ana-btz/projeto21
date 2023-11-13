import { invalidDataError, notFoundError } from '@/errors';
import { CreateTicket } from '@/protocols';
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

async function createTicket(userId: number, ticketTypeId: number) {
  if (!ticketTypeId) throw invalidDataError(`ticketTypeId`);

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollment) throw notFoundError();

  const data: CreateTicket = {
    enrollmentId: enrollment.id,
    ticketTypeId,
    status: `RESERVED`,
  };

  const ticket = await ticketsRepository.createTicket(data);

  return ticket;
}

export const ticketsService = {
  findTicketsTypes,
  findTicketByUserId,
  createTicket,
};
