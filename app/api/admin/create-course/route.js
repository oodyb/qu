import { createCourse } from "@/repos/admin";

export async function POST(request) {
  try {
    const body = await request.json();
    const newCourse = await createCourse(body);
    return Response.json(newCourse, { status: 201 });
  } catch (err) {
    console.error("CREATE COURSE ERROR:", err);
    if (err.message === "Course ID already exists") {
      return Response.json({ error: err.message }, { status: 409 });
    }
    return Response.json({ error: "Failed to create course" }, { status: 500 });
  }
}