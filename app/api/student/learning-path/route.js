import { getStudentLearningPath } from "@/repos/student";

export async function POST(req) {
    try {
        const { studentId } = await req.json();
        const { enrolled, completed } = await getStudentLearningPath(parseInt(studentId));
        return Response.json({ enrolled, completed });
    } catch (err) {
        console.error("Error fetching learning path:", err);
        return Response.json({ error: "Failed to fetch learning path" }, { status: 500 });
    }
}