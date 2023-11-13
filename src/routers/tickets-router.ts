import { Router } from 'express';
import { getTicket, getTicketsTypes } from '@/controllers';
import { authenticateToken } from '@/middlewares';

const ticketsRouter = Router();

ticketsRouter
    .all('/*', authenticateToken)
    .get('/types', getTicketsTypes)
    .get('/', getTicket)
    .post('/');

export { ticketsRouter };
