import { User } from "../src/schema/schema";


declare global {
    namespace Express {
        interface Request {
            user: User,
        } 
    }
}