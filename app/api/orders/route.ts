import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { getSession, requireAuth } from "@/lib/auth";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";
import { z } from "zod";

const itemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  name: z.string(),
  size: z.string().optional(),
  engraving: z.string().optional(),
  imageUrl: z.string().optional(),
});

const createOrderSchema = z.object({
  items: z.array(itemSchema).min(1),
  address: z.object({
    fullName: z.string(), phone: z.string(), line1: z.string(),
    line2: z.string().optional(), city: z.string(), state: z.string(),
    postalCode: z.string(), country: z.string().default("IN"),
  }),
  subtotal: z.number(), shipping: z.number(), tax: z.number(), total: z.number(),
  paymentIntentId: z.string(),
  couponCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const body = await req.json();
    const data = createOrderSchema.parse(body);

    const { data: user } = await supabase.from("users").select("email, name").eq("id", session.sub).single();

    const addressId = `addr_${Date.now()}`;
    await supabase.from("addresses").insert({
      id: addressId, userId: session.sub, label: "Shipping",
      fullName: data.address.fullName, phone: data.address.phone,
      line1: data.address.line1, line2: data.address.line2 ?? null,
      city: data.address.city, state: data.address.state,
      postalCode: data.address.postalCode, country: data.address.country,
    });

    const orderNumber = generateOrderNumber();
    const orderId = `ord_${Date.now()}`;

    await supabase.from("orders").insert({
      id: orderId, orderNumber, userId: session.sub, addressId,
      status: "CONFIRMED", paymentStatus: "PAID",
      paymentMethod: "razorpay", paymentIntentId: data.paymentIntentId,
      subtotal: data.subtotal, shipping: data.shipping, tax: data.tax,
      total: data.total, couponCode: data.couponCode ?? null,
    });

    const orderItems = data.items.map((item) => ({
      id: `oi_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      orderId, productId: item.productId, productName: item.name,
      productSku: item.productId, price: item.price, quantity: item.quantity,
      size: item.size ?? null, engraving: item.engraving ?? null, imageUrl: item.imageUrl ?? null,
    }));
    await supabase.from("order_items").insert(orderItems);

    for (const item of data.items) {
      const { data: prod } = await supabase.from("products").select("stock").eq("id", item.productId).single();
      if (prod) {
        await supabase.from("products").update({ stock: Math.max(0, prod.stock - item.quantity) }).eq("id", item.productId);
      }
    }

    if (user) {
      sendOrderConfirmation({
        to: user.email, name: user.name, orderNumber,
        items: data.items.map((i) => ({ productName: i.name, quantity: i.quantity, price: i.price, size: i.size })),
        total: data.total,
      }).catch(console.error);
    }

    return Response.json({ orderNumber, orderId }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return Response.json({ error: err.issues[0].message }, { status: 422 });
    const e = err as Error;
    if (e.message === "Unauthorized") return Response.json({ error: "Unauthorized" }, { status: 401 });
    console.error("Create order error:", err);
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { data: orders } = await supabase
      .from("orders")
      .select("*, items:order_items(*), address:addresses(*)")
      .eq("userId", session.sub)
      .order("createdAt", { ascending: false });

    return Response.json({ orders: orders ?? [] });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
