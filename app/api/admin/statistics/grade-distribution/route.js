import { getGradeDistribution } from "@/repos/statistics";

export async function GET() {
    try {
        const rawData = await getGradeDistribution();
        const formattedData = rawData.map(item => ({
            name: item.grade || 'No Grade',
            value: item._count.grade
        }));
        return new Response(JSON.stringify(formattedData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Failed to fetch grade distribution:", err);
        return new Response(JSON.stringify({ error: "Failed to load grade distribution" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}