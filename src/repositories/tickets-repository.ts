import { prisma } from "@/config"

async function findTicketsTypes() {
    const result = await prisma.ticketType.findMany();
    return result;
}

export const ticketsRepository = {
    findTicketsTypes
}