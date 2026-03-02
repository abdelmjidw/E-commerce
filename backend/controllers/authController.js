import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/token.js";
export const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (confirmPassword !== password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: "User not found" });
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid password" });
  const token = generateAccessToken(user);
  res.status(200).json({ message: "Login successful", user, token });
};
