import { PrismaClient } from "@prisma/client";

export const prismaConnection : PrismaClient = new PrismaClient();

prismaConnection.$connect();


