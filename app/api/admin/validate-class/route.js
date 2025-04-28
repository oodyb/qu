import { updateClassStatus } from "@/repos/admin";

export async function POST(req) {
  try {
    const { id, courseId } = await req.json();
    await updateClassStatus(id, courseId, "IN_PROGRESS");
    return Response.json({ success: true });
  } catch (err) {
    console.error("Validation error:", err);
    return Response.json({ error: "Failed to validate class" }, { status: 500 });
  }
}