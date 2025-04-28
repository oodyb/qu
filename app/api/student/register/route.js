import { registerStudent } from "@/repos/student";

export async function POST(req) {
  try {
    const { studentId, classId, courseId } = await req.json();

    if (!studentId || !classId || !courseId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await registerStudent(studentId, classId, courseId);
    return Response.json(result, { status: 201 });

  } catch (err) {
    let status = 400;

    if (err.message.includes("Class not found")) {
      status = 404;
    } else if (err.message.includes("Class is full")) {
      status = 409;
    } else if (err.message.includes("Prerequisite(s) Required")) {
      status = 422;
    }

    return Response.json({ error: err.message }, { status });
  }
}