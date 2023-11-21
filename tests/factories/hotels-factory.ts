import { prisma } from "@/config";
import faker from "@faker-js/faker";

export async function createHotel() {
    return await prisma.hotel.create({
        data: {
            image: faker.image.imageUrl(),
            name: faker.name.firstName()
        }
    })
}

export async function createRoomWithHotelId(hotelId: number) {
    return prisma.room.create({
        data: {
            name: '665',
            capacity: 1,
            hotelId: hotelId,
        },
    });
}