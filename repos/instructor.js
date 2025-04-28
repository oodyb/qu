import prisma from "@/repos/prisma";

export async function submitPreference(instructorId, courseId, classId) {
  return await prisma.preference.create({
    data: {
      instructorId,
      courseId,
      classId,
    },
  });
}

export async function getInstructorPreferences(instructorId) {
  return await prisma.preference.findMany({
    where: { instructorId },
    select: {
      courseId: true,
      classId: true,
    },
  });
}

export async function submitGrades(courseId, classId, grades) {
  const gradeUpdates = Object.entries(grades).map(([studentId, grade]) => {
    return prisma.enrollment.updateMany({
      where: {
        studentId: parseInt(studentId),
        courseId,
        classId,
      },
      data: {
        grade,
      },
    });
  });

  await Promise.all(gradeUpdates);

  await prisma.class.update({
    where: {
      id_courseId: {
        id: classId,
        courseId: courseId,
      },
    },
    data: {
      status: "COMPLETED",
    },
  });

  return { message: "Grades submitted and class completed" };
}

export async function getStudentsInClass(classId, courseId) {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      classId,
      courseId,
    },
    include: {
      student: true,
    },
  });

  return enrollments.map(enrollment => ({
    studentId: enrollment.studentId,
    name: enrollment.student.name,
    classId: enrollment.classId,
  }));
}

export async function getInstructorClasses(instructorId) {
  const classes = await prisma.class.findMany({
    where: {
      instructorId,
      status: "IN_PROGRESS",
    },
    include: {
      course: true,
    },
  });

  const grouped = {};

  classes.forEach(cls => {
    if (!grouped[cls.courseId]) {
      grouped[cls.courseId] = {
        courseId: cls.courseId,
        courseName: cls.course.name,
        classes: [],
      };
    }
    grouped[cls.courseId].classes.push({
      classId: cls.id,
    });
  });

  return Object.values(grouped);
}