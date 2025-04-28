import { getCoursesWithAndWithoutClasses } from "@/repos/statistics";

export async function GET() {
    try {
        const data = await getCoursesWithAndWithoutClasses();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Failed to fetch courses with/without classes:", err);
        return new Response(JSON.stringify({ error: "Failed to load courses with/without classes" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}