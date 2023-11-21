import app, { init } from "@/app";
import supertest from "supertest";
import * as jwt from 'jsonwebtoken';
import faker from "@faker-js/faker";
import { cleanDb, generateValidToken } from "../helpers";
import httpStatus from "http-status";
import { createEnrollmentWithAddress, createHotel, createPayment, createRoomWithHotelId, createTicket, createTicketType, createUser } from "../factories";
import { TicketStatus } from "@prisma/client";

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 if user has no enrollment', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get('hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if user has no ticket', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);

            const response = await server.get('hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if hotel does not exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, 'PAID');

            const response = await server.get('hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.NOT_FOUND);
        });

        it('should respond with status 402 if ticket was not paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, 'RESERVED');

            const response = await server.get('hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 if ticket is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(true, true);
            await createTicket(enrollment.id, ticketType.id, 'PAID');

            const response = await server.get('hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 if ticket do not include hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, false);
            await createTicket(enrollment.id, ticketType.id, 'PAID');

            const response = await server.get('hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 200 and hotels data', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            await createTicket(enrollment.id, ticketType.id, 'PAID');
            const hotel = await createHotel();

            const response = await server.get('hotels').set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(httpStatus.OK);
            expect(response.body).toEqual([
                {
                    id: hotel.id,
                    name: hotel.name,
                    image: hotel.image,
                    createdAt: hotel.createdAt.toISOString(),
                    updatedAt: hotel.updatedAt.toISOString()
                }
            ]);
        });
    });
});

describe('GET /hotels/:hotelId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/hotels/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {
        it('should respond with status 404 when user has no enrollment ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            await createTicketType(true);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if user has no ticket', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            await createEnrollmentWithAddress(user);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 404 if hotel does not exist', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            await createHotel();

            const response = await server.get('/hotels/100000').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.NOT_FOUND);
        });

        it('should respond with status 402 if ticket is remote ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const response = await server.get(`/hotels/1`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 if ticket is not paid ', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(true);
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 402 if ticket does nott include hotel', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, false);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.PAYMENT_REQUIRED);
        });

        it('should respond with status 200 and hotel with rooms', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType(false, true);
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            await createPayment(ticket.id, ticketType.price);

            const hotel = await createHotel();

            const room = await createRoomWithHotelId(hotel.id);

            const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

            expect(response.status).toEqual(httpStatus.OK);

            expect(response.body).toEqual({
                id: hotel.id,
                name: hotel.name,
                image: hotel.image,
                createdAt: hotel.createdAt.toISOString(),
                updatedAt: hotel.updatedAt.toISOString(),
                Rooms: [
                    {
                        id: room.id,
                        name: room.name,
                        capacity: room.capacity,
                        hotelId: hotel.id,
                        createdAt: room.createdAt.toISOString(),
                        updatedAt: room.updatedAt.toISOString(),
                    },
                ],
            });
        });
    });
});

