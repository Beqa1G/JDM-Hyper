import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from "drizzle-orm/neon-http/migrator";
import "dotenv/config";
import env from "../utils/validatedotenv";
import logger from '../utils/logger';

 
neonConfig.fetchConnectionCache = true;
 
const sql = neon(env.DRIZZLE_DATABASE_URL!);

const db = drizzle(sql);

export async function migration() {
    logger.info("migration started");
    await migrate(db, {migrationsFolder: "./migrations"})
}