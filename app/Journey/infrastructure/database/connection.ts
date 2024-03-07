import { PrismaClient } from "@prisma/client";

export const prismaConnection : PrismaClient = new PrismaClient();

prismaConnection.$connect();

prismaConnection.flight.findMany({
    where:{
        OR: [
            {
              Origin:"b",
              Destination:"a"
            },
          ]
    }
})

/* prismaConnection.journey.create({
    data:{
        Origin:"a",
        Destination:"findFlight",
        price:"a",
    }
})
prismaConnection.journey_Flight.create({
    data:{
        flightId:1,
        journeyId:2,
    }
}) */