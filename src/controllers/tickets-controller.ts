import { Response } from 'express';
import httpStatus from "http-status";
import { TicketBody } from '@/protocols';
import { ticketsService } from '@/services';
import { AuthenticatedRequest } from "@/middlewares";

export async function getTicketTypes(_req: AuthenticatedRequest, res: Response) {
    const ticketTypes = await ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const ticket = await ticketsService.getTicketByUserId(userId);
    return res.status(httpStatus.OK).send(ticket);
}

export async function createTicket(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const { ticketTypeId } = req.body as TicketBody;

    const ticket = await ticketsService.createTicket(userId, ticketTypeId);
    return res.status(httpStatus.CREATED).send(ticket);
}
