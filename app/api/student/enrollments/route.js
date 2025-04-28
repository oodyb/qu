import prisma from "@/repos/prisma";

export async function POST(req) {
  try {
    const { studentId } = await req.json();

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      select: {
        classId: true,
        courseId: true,
      }
    });

    return Response.json(enrollments);
  } catch (err) {
    console.error("Error fetching student enrollments:", err);
    return Response.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}