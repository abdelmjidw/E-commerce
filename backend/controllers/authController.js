import prisma from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";

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
    res
      .status(500)
      .json({ message: "Error fetching user data", error: error.message });
  }
};

// دالة التسجيل
export const register = async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Fields missing" });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords mismatch" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: role || "USER" },
    });

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // حفظ الـ Refresh Token في القاعدة
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });

  } catch (error) {
    console.error(error); // مهم جداً لرؤية الخطأ في الـ Terminal
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// دالة تسجيل الدخول
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // تنظيف التوكنات القديمة وحفظ الجديد
    await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(200).json({ user: userWithoutPassword, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};