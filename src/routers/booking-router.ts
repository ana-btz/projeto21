import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { bookingPost, getBookingByUserId } from "@/controllers";

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBookingByUserId)
    .post('/', bookingPost)

export { bookingRouter };