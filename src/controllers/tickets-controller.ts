import { Response } from 'express';
import httpStatus from "http-status";
import { ticketsService } from '@/services';
import { AuthenticatedRequest } from "@/middlewares";

export async function getTicketTypes(_req: AuthenticatedRequest, res: Response) {
    const ticketTypes = await ticketsService.getTicketTypes();
    return res.status(httpStatus.OK).send(ticketTypes);
}
