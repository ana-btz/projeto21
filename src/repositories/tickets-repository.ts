import { prisma } from "@/config";
import { TicketType } from "@prisma/client";

async function findTicketTypes(): Promise<TicketType[]> {
    const result = await prisma.ticketType.findMany();
    return result;
}

async function findTicketByEnrollmentId(enrollmentId: number) {
    const result = await prisma.ticket.findUnique({
        where: { enrollmentId },
        include: { TicketType: true },
    });
    return result;
}

export const ticketsRepository = {
    findTicketTypes,
    findTicketByEnrollmentId
};