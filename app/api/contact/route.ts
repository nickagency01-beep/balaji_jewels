import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
});

const TO = "hello@balajijewels.com";

function buildAdminHtml(name: string, email: string, subject: string, message: string) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;background:#f5f0e8;margin:0;padding:32px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2d9c8;border-radius:2px;overflow:hidden">
    <div style="background:#0f3d2e;padding:24px 32px">
      <p style="color:#c9a84c;letter-spacing:4px;font-size:12px;margin:0;font-family:Arial,sans-serif">BALAJI FINE JEWELRY</p>
    </div>
    <div style="padding:32px">
      <h2 style="color:#0f3d2e;margin:0 0 20px;font-size:20px">New Contact Form Submission</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#888;width:80px">From</td><td style="padding:8px 0;color:#1a1a1a"><strong>${name}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#0f3d2e">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#888">Subject</td><td style="padding:8px 0;color:#1a1a1a">${subject}</td></tr>
      </table>
      <hr style="border:none;border-top:1px solid #e2d9c8;margin:20px 0">
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0;white-space:pre-wrap">${message}</p>
    </div>
    <div style="background:#f5f0e8;padding:16px 32px;font-size:12px;color:#888;font-family:Arial,sans-serif">
      Reply directly to this email to respond to ${name}.
    </div>
  </div>
</body>
</html>`;
}

function buildConfirmationHtml(name: string) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;background:#f5f0e8;margin:0;padding:32px">
  <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2d9c8;border-radius:2px;overflow:hidden">
    <div style="background:#0f3d2e;padding:24px 32px">
      <p style="color:#c9a84c;letter-spacing:4px;font-size:12px;margin:0;font-family:Arial,sans-serif">BALAJI FINE JEWELRY</p>
    </div>
    <div style="padding:32px">
      <h2 style="color:#0f3d2e;margin:0 0 12px;font-size:20px">Thank you, ${name}</h2>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0 0 20px">
        We have received your message and will get back to you within 24 hours.
      </p>
      <p style="font-size:14px;color:#444;line-height:1.7;margin:0">
        In the meantime, you can browse our latest collections or visit our showroom at
        12, Zaveri Bazaar, Mumbai, Monday–Saturday 10am–8pm.
      </p>
    </div>
    <div style="background:#f5f0e8;padding:16px 32px;font-size:12px;color:#888;font-family:Arial,sans-serif">
      BALAJI Fine Jewelry · 12, Zaveri Bazaar, Mumbai 400002 · hello@balajijewels.com
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid form data", issues: parsed.error.issues }, { status: 422 });
  }

  const { name, email, subject, message } = parsed.data;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"BALAJI Fine Jewelry" <${process.env.SMTP_USER}>`,
    to: TO,
    replyTo: `"${name}" <${email}>`,
    subject: `Contact: ${subject}`,
    html: buildAdminHtml(name, email, subject, message),
  });

  await transporter.sendMail({
    from: `"BALAJI Fine Jewelry" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "We received your message — BALAJI Fine Jewelry",
    html: buildConfirmationHtml(name),
  });

  return Response.json({ ok: true });
}
