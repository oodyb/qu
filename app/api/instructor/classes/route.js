import { getInstructorClasses } from "@/repos/instructor";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const instructorId = searchParams.get('instructorId');

        if (!instructorId) {
            return Response.json({ error: "Instructor ID missing" }, { status: 400 });
        }

        const classes = await getInstructorClasses(parseInt(instructorId));
        return Response.json(classes);
    } catch (err) {
        console.error("Error fetching instructor classes:", err);
        return Response.json({ error: "Failed to fetch classes" }, { status: 500 });
    }
}