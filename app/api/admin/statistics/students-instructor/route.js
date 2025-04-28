import { getStudentsPerInstructor } from "@/repos/statistics";
import prisma from "@/repos/prisma";

export async function GET() {
    try {
        const rawData = await getStudentsPerInstructor();

        // Get instructor names
        const instructors = await prisma.user.findMany({
            where: {
                id: {
                    in: rawData.map(item => item.instructorId)
                }
            },
            select: {
                id: true,
                name: true
            }
        });

        const instructorMap = {};
        instructors.forEach(instructor => {
            instructorMap[instructor.id] = instructor.name;
        });

        const formattedData = rawData.map(item => ({
            name: instructorMap[item.instructorId] || `Instructor ${item.instructorId}`,
            value: item.studentCount
        }));

        return new Response(JSON.stringify(formattedData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Failed to fetch students per instructor:", err);
        return new Response(JSON.stringify({ error: "Failed to load students per instructor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}