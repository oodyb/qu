import { submitGrades } from "@/repos/instructor";

export async function POST(req) {
  try {
    const { courseId, classId, grades } = await req.json();

    if (!courseId || !classId || !grades) {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    const result = await submitGrades(courseId, classId, grades);
    return Response.json(result);
  } catch (err) {
    console.error("Error submitting grades:", err);
    return Response.json({ error: "Failed to submit grades" }, { status: 500 });
  }
}