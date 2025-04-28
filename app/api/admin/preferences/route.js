import { getAllPreferences } from "@/repos/admin";
import { assignInstructorToCourse } from "@/repos/admin";

export async function GET() {
  try {
    const data = await getAllPreferences();
    return Response.json(data);
  } catch (err) {
    console.error(err);
    return Response.json([], { status: 500 });
  }
}