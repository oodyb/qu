import prisma from "@/repos/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({
    select: {
      id: true,
      name: true
    }
  });
  return Response.json(courses);
}