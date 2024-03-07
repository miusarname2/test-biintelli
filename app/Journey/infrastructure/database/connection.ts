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

