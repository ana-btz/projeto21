import { ticketsRepository } from "@/repositories";

async function getTicketTypes() {
    const ticketTypes = await ticketsRepository.findTicketTypes();
    return ticketTypes;
}

export const ticketsService = {
    getTicketTypes
};