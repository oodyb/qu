import { getClassCapacityVsEnrollment } from "@/repos/statistics";
import prisma from "@/repos/prisma";

export async function GET() {
    try {
        const rawData = await getClassCapacityVsEnrollment();

        // Get course names
        const courseIds = [...new Set(rawData.map(item => item.courseId))];
        const courses = await prisma.course.findMany({
            where: {
                id: {
                    in: courseIds
                }
            },
            select: {
                id: true,
                name: true
            }
        });

        const courseMap = {};
        courses.forEach(course => {
            courseMap[course.id] = course.name;
        });

        const formattedData = rawData.map(item => ({
            name: `${courseMap[item.courseId] || 'Course ' + item.courseId} (Class ${item.classId})`,
            value: item.enrolled,
            capacity: item.capacity,
            utilization: item.capacity > 0 ? Math.round((item.enrolled / item.capacity) * 100) : 0
        }));

        return new Response(JSON.stringify(formattedData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Failed to fetch capacity vs enrollment:", err);
        return new Response(JSON.stringify({ error: "Failed to load capacity vs enrollment" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}