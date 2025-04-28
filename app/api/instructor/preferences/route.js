import { submitPreference, getInstructorPreferences } from "@/repos/instructor";

export async function POST(req) {
  try {
    const { instructorId, courseId, classId } = await req.json();

    if (!instructorId || !courseId || !classId) {
      return Response.json({ error: "Invalid data" }, { status: 400 });
    }

    const result = await submitPreference(instructorId, courseId, classId);
    return Response.json(result);
  } catch (err) {
    console.error("Error submitting preference:", err);
    return Response.json({ error: "Failed to submit preference" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const instructorId = searchParams.get('instructorId');

    if (!instructorId) {
      return Response.json({ error: "Instructor ID missing" }, { status: 400 });
    }

    const preferences = await getInstructorPreferences(parseInt(instructorId));
    return Response.json(preferences);
  } catch (err) {
    console.error("Error fetching instructor preferences:", err);
    return Response.json({ error: "Failed to fetch preferences" }, { status: 500 });
  }
}