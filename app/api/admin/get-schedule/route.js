import { getAllInProgress } from "@/repos/admin";

export async function GET() {
    try {
        const classes = await getAllInProgress();
        console.log("Classes from database:", classes);
        return Response.json(classes);
    } catch (err) {
        console.error("Error fetching schedule:", err);
        return Response.json({ error: "Failed to fetch schedule" }, { status: 500 });
    }
}
