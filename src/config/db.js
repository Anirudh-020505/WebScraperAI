import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

console.log("Prisma Client Initiated")

export default prisma;