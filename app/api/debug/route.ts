export async function GET() {
  const url = process.env.DATABASE_URL ?? "NOT SET";
  const masked = url.replace(/:([^:@]+)@/, ":***@");
  return Response.json({ DATABASE_URL: masked });
}
