import prisma from "../config/db.js";

export const createOrder = async (req, res) => {
  const { items, phone, address,status, totalPrice, couponId } = req.body; 
  // items: [{productId, quantity, price}]

  try {
    // استخدام $transaction لضمان تنفيذ كل العمليات أو فشلها جميعاً
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. إنشاء الطلب الأساسي مع بنود الطلب
      const order = await tx.order.create({
        data: {
          userId: req.user.id,
          phone,
          address,
          totalPrice: Number(totalPrice),
          couponId: couponId ? Number(couponId) : null,
          orderItems: {
            create: items.map(item => ({
              productId: Number(item.productId),
              quantity: Number(item.quantity),
              price: Number(item.price)
            }))
          }
        },
        include: { orderItems: true }
      });

      // 2. تحديث المخزون (Stock) لكل منتج تم شراؤه
      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: Number(item.productId) }
        });

        if (!product || product.stock < item.quantity) {
          throw new Error(`Product ${product?.name || item.productId} is out of stock!`);
        }

        await tx.product.update({
          where: { id: Number(item.productId) },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // 3. مسح سلة التسوق الخاصة بالمستخدم بعد نجاح الطلب
      await tx.cartItem.deleteMany({
        where: { cart: { userId: req.user.id } }
      });

      return order;
    });

    res.status(201).json({ message: "Order placed successfully", order: result });

  } catch (error) {
    console.error("Order Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// جلب طلبات المستخدم الحالي
export const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { 
        orderItems: { 
          include: { 
            product: { select: { name: true, imageUrl: true } } 
          } 
        } 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// للأدمن: جلب كل الطلبات لمتابعة المبيعات في Galaxy Digital
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { 
        user: { select: { name: true, email: true } },
        _count: { select: { orderItems: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
};