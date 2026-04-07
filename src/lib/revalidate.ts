export async function revalidatePath(path: string) {
  const secret = process.env.REVALIDATION_SECRET;
  if (!secret) throw new Error("REVALIDATION_SECRET not configured");

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/revalidate?path=${encodeURIComponent(path)}&secret=${secret}`,
    { method: "POST" }
  );

  if (!res.ok) throw new Error("Revalidation failed");
  return res.json();
}
