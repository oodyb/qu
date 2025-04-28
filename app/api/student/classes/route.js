import { getAvailableClasses } from "@/repos/student";

export async function GET() {
  try {
    const classes = await getAvailableClasses();
    return Response.json(classes);
  } catch (err) {
    console.error("Error fetching student classes:", err);
    return Response.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}