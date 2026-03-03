import prisma from "../config/db.js";

// 1. جلب جميع المراجعات مع إمكانية التصفية حسب المنتج
export const getReviews = async (req, res) => {
  const { productId } = req.query;
  try {
    const reviews = await prisma.review.findMany({
      where: {
        ...(productId && { productId: Number(productId) }),
      },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error: error.message });
  }
};

// 2. جلب مراجعة واحدة بحسب المعرف
export const getOneReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await prisma.review.findUnique({
      where: { id: Number(id) },
      include: {
        user: { select: { id: true, name: true } },
        product: { select: { id: true, name: true } },
      },
    });
    if (!review) return res.status(404).json({ message: "Review not found" });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Error fetching review", error: error.message });
  }
};

// 3. إنشاء مراجعة جديدة
export const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;
  if (!productId || rating === undefined) {
    return res.status(400).json({ message: "productId and rating are required" });
  }

  try {
    const review = await prisma.review.create({
      data: {
        productId: Number(productId),
        userId: req.user.id,
        rating: Number(rating),
        comment,
      },
    });
    res.status(201).json(review);
  } catch (error) {
    // unique constraint violation (user already reviewed this product)
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }
    res.status(400).json({ message: "Failed to create review", error: error.message });
  }
};

// 4. تحديث مراجعة
export const updateReview = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.review.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ message: "Review not found" });

    // only owner or admin can update
    if (existing.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    const updateData = { ...req.body };
    if (updateData.rating !== undefined) updateData.rating = Number(updateData.rating);

    const updated = await prisma.review.update({
      where: { id: Number(id) },
      data: updateData,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
};

// 5. حذف مراجعة
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await prisma.review.findUnique({ where: { id: Number(id) } });
    if (!existing) return res.status(404).json({ message: "Review not found" });

    if (existing.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await prisma.review.delete({ where: { id: Number(id) } });
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(400).json({ message: "Delete failed", error: error.message });
  }
};