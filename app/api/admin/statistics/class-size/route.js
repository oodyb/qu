import { getClassSizesPerCourse } from "@/repos/statistics";

export async function GET() {
    try {
        const rawData = await getClassSizesPerCourse();

        const formattedData = rawData.map(item => ({
            name: `${item.courseName} (Class ${item.classId})`,
            value: item.enrolledStudents,
            capacity: item.capacity,
            fillRate: item.capacity > 0 ? Math.round((item.enrolledStudents / item.capacity) * 100) : 0
        }));

        return new Response(JSON.stringify(formattedData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Failed to fetch class sizes per course:", err);
        return new Response(JSON.stringify({ error: "Failed to load class sizes per course" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}