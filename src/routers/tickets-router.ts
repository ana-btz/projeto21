import { Router } from 'express';
import { ticketSchema } from '@/schemas';
import { createTicket, getTicket, getTicketTypes } from '@/controllers';
import { authenticateToken, validateBody } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getTicketTypes)
    .get('/', getTicket)
    .post('/', validateBody(ticketSchema), createTicket)

export { ticketsRouter };
