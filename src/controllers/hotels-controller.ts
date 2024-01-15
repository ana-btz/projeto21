import { Response } from 'express';
import httpStatus from 'http-status';
import { hotelsService } from '@/services';
import { AuthenticatedRequest } from "@/middlewares";

export async function getHotels(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    const hotels = await hotelsService.getHotels(userId);
    res.status(httpStatus.OK).send(hotels);
}

export async function getHotelsWithRooms(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const hotelId = Number(req.params.hotelId);
  
    const hotelWithRooms = await hotelsService.getHotelsWithRooms(userId, hotelId);
    res.status(httpStatus.OK).send(hotelWithRooms);
  }