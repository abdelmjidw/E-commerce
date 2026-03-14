import prisma from "../config/db.js";

export const getDashboardStats = async (req, res) => {
  try {

    const totalSales = await prisma.order.aggregate({
      where: {
        paymentStatus: "PAID",
      },
      _sum: {
        totalPrice: true,
      },
    });

    // 2. عدد المستخدمين، المنتجات، والطلبات
    const [usersCount, productsCount, ordersCount] = await Promise.all([
      prisma.user.count({ where: { deleted: false } }),
      prisma.product.count({ where: { deleted: false } }),
      prisma.order.count(),
    ]);

    // 3. آخر 5 طلبات تم إجراؤها
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // 4. المنتجات الأكثر مبيعاً (Top Selling)
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    // جلب تفاصيل هذه المنتجات
    const topProductsDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true, price: true, imageUrl: true }
        });
        return { ...product, totalSold: item._sum.quantity };
      })
    );

    res.status(200).json({
      stats: {
        revenue: totalSales._sum.totalPrice || 0,
        users: usersCount,
        products: productsCount,
        orders: ordersCount,
      },
      recentOrders,
      topProducts: topProductsDetails,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

// --- إدارة المنتجات (Admin Product CRUD) ---

export const getAllProductsAdmin = async (req, res) => {
    const products = await prisma.product.findMany({
        where: { deleted: false },
        include: { category: true }
    });
    res.json(products);
};

export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;
    try {
        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status, paymentStatus }
        });
        res.json({ message: "Order updated", updatedOrder });
    } catch (error) {
        res.status(500).json({ message: "Update failed" });
    }
};