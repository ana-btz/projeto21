import { prisma } from "@/config";
import { TicketType } from "@prisma/client";

async function findTicketTypes(): Promise<TicketType[]> {
    const result = await prisma.ticketType.findMany();
    return result;
}

export const ticketsRepository = {
    findTicketTypes
};