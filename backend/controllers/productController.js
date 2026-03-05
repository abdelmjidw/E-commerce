import prisma from "../config/db.js";
import cloudinary from "../utils/cloudinary.js";

// جلب الكل مع دعم التصنيفات والترقيم (Pagination)
export const getProducts = async (req, res) => {
  const { categoryId, page = 1, limit = 10 } = req.query;

  try {
    // تحويل القيم إلى أرقام
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // تحديد شروط الفلترة
    const whereCondition = {
      deleted: false,
      ...(categoryId && { categoryId: Number(categoryId) }),
    };

    // تنفيذ الطلبين في وقت واحد (البيانات + العدد الإجمالي) لزيادة السرعة
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        include: { category: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        skip: skip,
        take: limitNum,
      }),
      prisma.product.count({ where: whereCondition })
    ]);

    // حساب إجمالي الصفحات
    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      data: products,
      pagination: {
        totalProducts: totalCount,
        totalPages: totalPages,
        currentPage: pageNum,
        pageSize: limitNum,
      }
    });
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



export const createProduct = async (req, res) => {
  const { name, description, price, originalPrice, stock, categoryId } = req.body;
  
  try {
    let imageUrl = "";

    // 1. Check if an image was uploaded via multer (req.file)
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "galaxy_digital_products", // Creates a folder in your Cloudinary account
      });
      imageUrl = result.secure_url; // Use the secure link from Cloudinary
    }

    if (!name || !price || !categoryId || !imageUrl) {
      return res.status(400).json({ message: "Name, Price, Category, and Image are required" });
    }

    const product = await prisma.product.create({
      data: { 
        name, 
        description, 
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        stock: Number(stock) || 0,
        imageUrl: imageUrl, 
        categoryId: Number(categoryId) 
      }
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updateData = { ...req.body };
    
    // If a new image is provided, upload it and update the URL
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "galaxy_digital_products",
      });
      updateData.imageUrl = result.secure_url;
    }

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