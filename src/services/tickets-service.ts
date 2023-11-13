import { ticketsRepository } from "@/repositories"

async function findTicketsTypes() {
    const types = await ticketsRepository.findTicketsTypes();
    return types;
}

export const ticketsService = {
    findTicketsTypes
} 