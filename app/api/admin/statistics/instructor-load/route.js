import { getInstructorLoad } from "@/repos/statistics";
import prisma from "@/repos/prisma";

export async function GET() {
    try {
        const rawData = await getInstructorLoad();

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
            value: item._count.instructorId
        }));

        return new Response(JSON.stringify(formattedData), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Failed to fetch instructor load:", err);
        return new Response(JSON.stringify({ error: "Failed to load instructor load" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}