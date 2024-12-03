import crypto from "crypto";

export const generateToken = () => {
  return crypto.randomBytes(20).toString("hex");
};