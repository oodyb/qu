import { deleteClassById } from "@/repos/admin";

export async function POST(req) {
  try {
    const { id, courseId } = await req.json();
    if (!id || !courseId) {
      return Response.json({ error: "Missing id or courseId" }, { status: 400 });
    }

    const deleted = await deleteClassById(id, courseId);
    return Response.json(deleted);
  } catch (err) {
    console.error("Error deleting class:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}