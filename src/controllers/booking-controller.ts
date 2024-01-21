import { Response } from 'express';
import httpStatus from "http-status";
import { bookingService } from '@/services';
import { AuthenticatedRequest } from "@/middlewares";

export async function getBookingByUserId(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const userBooking = await bookingService.getBookingByUserId(userId);

    return res.status(httpStatus.OK).send(userBooking);
}