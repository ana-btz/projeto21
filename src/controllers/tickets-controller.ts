import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';
import { Response } from 'express';
import httpStatus from 'http-status';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
    const types = await ticketsService.findTicketsTypes();
    res.status(httpStatus.OK).send(types);
}