import { getAllInstructors } from "@/repos/admin";

export async function GET() {
    try {
        const instructors = await getAllInstructors();
        return Response.json(instructors);
    } catch (err) {
        console.error("GET INSTRUCTORS ERROR:", err);
        return Response.json({ error: "Failed to fetch instructors" }, { status: 500 });
    }
}