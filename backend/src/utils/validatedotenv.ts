import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  DRIZZLE_DATABASE_URL: str(),
  PORT: port(),
  ACCESS_TOKEN_SECRET: str({ desc: "Access token secret" }),
  REFRESH_TOKEN_SECRET: str({ desc: "Refresh token secret" }),
});
