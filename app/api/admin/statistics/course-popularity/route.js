import { getCoursePopularity } from "@/repos/statistics";
import prisma from "@/repos/prisma";

export async function GET() {
    try {
        const rawData = await getCoursePopularity();

        // Get course names
        const courses = await prisma.course.findMany({
            where: {
                id: {
                    in: rawData.map(item => item.courseId)
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
            name: courseMap[item.courseId] || `Course ${item.courseId}`,
            value: item._count.courseId
        }));

        return new Response(JSON.stringify(formattedData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Failed to fetch course popularity:", err);
        return new Response(JSON.stringify({ error: "Failed to load course popularity" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}