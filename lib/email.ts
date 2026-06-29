import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  size?: string | null;
}

export async function sendOrderConfirmation(opts: {
  to: string;
  name: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
}) {
  const itemsHtml = opts.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #e8e3d9">${item.productName}${item.size ? ` (Size ${item.size})` : ""}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e8e3d9;text-align:center">${item.quantity}</td>
        <td style="padding:8px 0;border-bottom:1px solid #e8e3d9;text-align:right">$${(item.price * item.quantity).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  await transporter.sendMail({
    from: `"LUMORA Jewelry" <${process.env.SMTP_USER}>`,
    to: opts.to,
    subject: `Your LUMORA Order #${opts.orderNumber} is confirmed`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:'Inter',sans-serif;background:#faf8f3;margin:0;padding:20px">
        <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
          <div style="background:#0f3d2e;padding:32px;text-align:center">
            <h1 style="font-family:Georgia,serif;color:#c9a84c;margin:0;font-size:32px;letter-spacing:4px">LUMORA</h1>
            <p style="color:#a8d5b5;margin:8px 0 0;font-size:13px;letter-spacing:2px">FINE JEWELRY</p>
          </div>
          <div style="padding:40px">
            <h2 style="color:#0f3d2e;font-family:Georgia,serif;font-size:22px">Thank you, ${opts.name}.</h2>
            <p style="color:#555;line-height:1.6">Your order <strong>#${opts.orderNumber}</strong> has been confirmed. We're crafting your piece with the utmost care.</p>
            <table style="width:100%;border-collapse:collapse;margin:24px 0">
              <thead>
                <tr>
                  <th style="text-align:left;padding-bottom:12px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">Item</th>
                  <th style="text-align:center;padding-bottom:12px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">Qty</th>
                  <th style="text-align:right;padding-bottom:12px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">Price</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
              <tfoot>
                <tr>
                  <td colspan="2" style="padding-top:16px;font-weight:600;color:#0f3d2e">Total</td>
                  <td style="padding-top:16px;font-weight:600;color:#c9a84c;text-align:right;font-size:18px">$${opts.total.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
            <p style="color:#555;font-size:14px">We'll send tracking information once your order ships. Expect delivery in 5–10 business days.</p>
            <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e8e3d9;text-align:center">
              <p style="color:#999;font-size:12px">Questions? Reply to this email or visit lumora.com/support</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendPasswordReset(opts: { to: string; name: string; resetUrl: string }) {
  await transporter.sendMail({
    from: `"LUMORA Jewelry" <${process.env.SMTP_USER}>`,
    to: opts.to,
    subject: "Reset your LUMORA password",
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:40px auto">
        <h2 style="color:#0f3d2e">Reset your password</h2>
        <p>Hi ${opts.name}, click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${opts.resetUrl}" style="display:inline-block;background:#c9a84c;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0">Reset Password</a>
        <p style="color:#999;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
