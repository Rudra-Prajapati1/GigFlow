import jwt, { SignOptions } from "jsonwebtoken";

export const generateToken = (id: string, role: "admin" | "sales"): string => {
  const options: SignOptions = {
    expiresIn: "7d",
  };
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, options);
};
