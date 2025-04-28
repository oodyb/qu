import { getAllClasses } from "@/repos/admin";

export async function GET() {
  try {
    const classes = await getAllClasses();
    return Response.json(classes);
  } catch (err) {
    return Response.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}