import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
});


const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Prisma Client connected successfully");
        const result = await prisma.$queryRaw`SELECT 1`;
        console.log("Database connected and test query success:", result);
    }catch (error) {
        if (error.message.includes('Can\'t reach database server')) {          
        }
        console.error(`${error}`);
    }
};

const disconnectDB = async()=>{
    await prisma.$disconnect();
    console.log("Database disconnected successfully");
};
export { prisma, connectDB, disconnectDB };

