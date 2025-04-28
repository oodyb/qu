import { getStudentsInClass } from "@/repos/instructor";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');
    const courseId = searchParams.get('courseId');

    if (!classId || !courseId) {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    const students = await getStudentsInClass(classId, courseId);
    return Response.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    return Response.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}