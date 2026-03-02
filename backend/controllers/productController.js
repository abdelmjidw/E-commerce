import prisma from "../config/db.js";

// 1. جلب الكل مع دعم التصنيفات
export const getProducts = async (req, res) => {
  const { categoryId } = req.query;
  try {
    const products = await prisma.product.findMany({
      where: {
        deleted: false,
        ...(categoryId && { categoryId: Number(categoryId) }),
      },
      include: { category: { select: { name: true } } }, // جلب اسم التصنيف فقط لتقليل حجم البيانات
      orderBy: { createdAt: 'desc' } // الأحدث أولاً
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// 2. جلب منتج واحد (تعديل من query إلى params)
export const getOneProduct = async (req, res) => {
  const { id } = req.params; // استخدام params أفضل
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// 3. إنشاء منتج (مع إضافة تحويل الأنواع)
export const createProduct = async (req, res) => {
  const { name, description, price, originalPrice, stock, imageUrl, categoryId } = req.body;
  
  if (!name || !price || !categoryId) {
    return res.status(400).json({ message: "Name, Price, and Category are required" });
  }

  try {
    const product = await prisma.product.create({
      data: { 
        name, 
        description, 
        price: Number(price), // التأكد من أنه رقم
        originalPrice: originalPrice ? Number(originalPrice) : null,
        stock: Number(stock) || 0,
        imageUrl, 
        categoryId: Number(categoryId) 
      }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: "Failed to create product", error: error.message });
  }
};

// 4. تحديث المنتج (تعديل الحقول الرقمية)
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    // نقوم بفلترة البيانات للتأكد من أن الأرقام يتم تحويلها بشكل صحيح
    const updateData = { ...req.body };
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.stock) updateData.stock = Number(updateData.stock);
    if (updateData.categoryId) updateData.categoryId = Number(updateData.categoryId);

    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: updateData
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

// 5. الحذف الناعم (Soft Delete)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.update({
      where: { id: Number(id) },
      data: { deleted: true }
    });
    res.json({ message: "Product moved to trash" });
  } catch (error) {
    res.status(400).json({ message: "Delete failed" });
  }
};