import prisma from "@/repos/prisma";

export async function getAllInstructors() {
  return await prisma.user.findMany({
    where: { role: "INSTRUCTOR" },
    select: { id: true, name: true }
  });
}

export async function getAllPreferences() {
  return await prisma.preference.findMany({
    include: {
      instructor: true,
      class: { include: { course: true } }
    }
  });
}

export async function getAllInProgress() {
  const classes = await prisma.class.findMany({
    where: { status: "IN_PROGRESS" },
    include: {
      course: true, instructor: true
    }
  });

  return classes.map((cls) => ({
    id: cls.id,
    courseId: cls.courseId,
    courseName: cls.course.name,
    schedule: cls.schedule,
    instructorName: cls.instructor ? cls.instructor.name : "Unassigned",
    status: cls.status,
  }));
}

export async function getAllClasses() {
  const classes = await prisma.class.findMany({
    include: { course: true, enrollments: true, instructor: true }
  });

  return classes.map((cls) => ({
    classId: cls.id,
    courseId: cls.courseId,
    courseName: cls.course.name,
    category: cls.course.category,
    status: cls.status,
    currentStudents: cls.enrollments.length,
    instructorName: cls.instructor ? cls.instructor.name : 'Unassigned',
    instructorId: cls.instructorId,
    capacity: cls.capacity,
  }));
}

export async function rejectPreference(preferenceId) {
  return await prisma.preference.delete({
    where: { id: preferenceId },
  });
}

export async function approvePreference(preferenceId, classId, courseId) {
  const pref = await prisma.preference.findUnique({ where: { id: preferenceId } });
  return await prisma.class.update({
    where: {
      id_courseId: { id: classId, courseId: courseId }
    }, data: { instructorId: pref.instructorId }
  });
}

export async function createClass(data) {
  const { id, courseId, instructorId, status, capacity, schedule } = data;
  return await prisma.class.create({
    data: {
      id,
      courseId,
      instructorId: isNaN(instructorId) ? null : instructorId,
      status,
      capacity,
      schedule,
    }
  });
}

export async function updateClassStatus(id, courseId, newStatus) {
  return await prisma.class.update({
    where: { id_courseId: { id, courseId } },
    data: { status: newStatus },
  });
}

export async function deleteClassById(id, courseId) {
  await prisma.enrollment.deleteMany({
    where: { classId: id }
  });

  return await prisma.class.delete({
    where: { id_courseId: { id, courseId } }
  });
}

export async function createCourse(data) {
  const { id, name, category, description, creditHours, minStudents, maxStudents, prerequisites = [] } = data;

  const flatPrereqs = Array.isArray(prerequisites)
    ? prerequisites.flat().filter((id) => typeof id === "string" && id.trim() !== "")
    : [];

  const validPrereqCourses = await prisma.course.findMany({
    where: { id: { in: flatPrereqs } },
    select: { id: true },
  });

  const cleanedPrerequisites = validPrereqCourses.map((course) => ({ id: course.id }));

  return await prisma.course.create({
    data: {
      id,
      name,
      category,
      description,
      creditHours,
      minStudents,
      maxStudents,
      ...(cleanedPrerequisites.length > 0 && {
        prerequisites: {
          connect: cleanedPrerequisites,
        },
      }),
    },
  });
}