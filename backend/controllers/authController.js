import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/token.js";

// 1. Get Current User Data (The "getMe" function)
export const getMe = async (req, res) => {
  try {
    // req.user.id comes from your 'protect' middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data", error: error.message });
  }
};

// 2. Register Function
export const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (confirmPassword !== password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Remove password from object before sending response
    const { password: _, ...userWithoutPassword } = user;
    const token = generateAccessToken(user);

    res.status(201).json({ 
      message: "User registered successfully", 
      user: userWithoutPassword,
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// 3. Login Function
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });

    const token = generateAccessToken(user);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({ 
      message: "Login successful", 
      user: userWithoutPassword, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};