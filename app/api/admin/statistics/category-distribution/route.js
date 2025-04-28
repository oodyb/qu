import { getCourseCategoryDistribution } from "@/repos/statistics";

export async function GET() {
    try {
        const data = await getCourseCategoryDistribution();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Failed to fetch category distribution:", err);
        return new Response(JSON.stringify({ error: "Failed to load category distribution" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}