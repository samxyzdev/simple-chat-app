import { cookies } from "next/headers";

export async function GET() {
  const token = (await cookies()).get("sid")?.value;
  return Response.json({ token });
}
