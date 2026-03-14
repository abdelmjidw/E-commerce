import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" } 
  );
};
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET, 
    { expiresIn: "7d" }
  );
};