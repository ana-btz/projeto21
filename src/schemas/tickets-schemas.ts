import Joi from 'joi';
import { TicketBody } from '@/protocols';

export const ticketSchema = Joi.object<TicketBody>({
    ticketTypeId: Joi.number().integer().min(1).required(),
});