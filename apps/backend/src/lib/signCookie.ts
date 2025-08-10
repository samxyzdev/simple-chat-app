import { createHmac } from "crypto";
import { JWT_SECRET } from "../config.js";

export const signCookie = (cookie: any, userId?: any) => {
  const signature = createHmac("sha256", JWT_SECRET)
    .update(cookie)
    .digest("hex");

  return `${cookie}.${signature}.${userId}`;
};
