import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
    const types = await ticketsService.findTicketsTypes();
    return res.status(httpStatus.OK).send(types);
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const ticket = await ticketsService.findTicketByUserId(userId);

    return res.status(httpStatus.OK).send(ticket);
}