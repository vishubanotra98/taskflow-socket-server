import bcrypt from "bcrypt";

export const passwordHash = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const decryptHashedPassowrd = async (
  password: string,
  hashedPassword: string,
) => {
  const res = await bcrypt.compare(password, hashedPassword);
  return res;
};
