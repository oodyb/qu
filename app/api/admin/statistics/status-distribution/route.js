import { getClassStatusDistribution } from "@/repos/statistics";

export async function GET() {
    try {
        const rawData = await getClassStatusDistribution();
        const formattedData = rawData.map(item => ({
            name: item.status || 'Unknown Status',
            value: item._count.status
        }));
        return new Response(JSON.stringify(formattedData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Failed to fetch class status distribution:", err);
        return new Response(JSON.stringify({ error: "Failed to load class status distribution" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}