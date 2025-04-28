import prisma from "@/repos/prisma";

export async function getStudentLearningPath(studentId) {
    const enrollments = await prisma.enrollment.findMany({
        where: { studentId },
        include: {
            class: {
                include: {
                    course: true,
                    instructor: true
                }
            }
        }
    });

    const enrolled = [];
    const completed = [];

    enrollments.forEach((enrollment) => {
        const cls = enrollment.class;
        const course = cls.course;
        const instructor = cls.instructor ? cls.instructor.name : "Unknown";

        const courseData = {
            name: course.name,
            category: course.category,
            instructor,
            classId: cls.id,
        };

        if (cls.status === "IN_PROGRESS") {
            enrolled.push(courseData);
        } else if (cls.status === "COMPLETED") {
            completed.push({
                ...courseData,
                grade: enrollment.grade || "N/A",
            });
        }
    });

    return { enrolled, completed };
}

export async function getAvailableClasses() {
    const classes = await prisma.class.findMany({
        where: {
            status: "OPEN",
        },
        include: {
            course: true,
            instructor: true,
            enrollments: true,
        },
    });

    return classes.map(cls => ({
        classId: cls.id,
        courseId: cls.courseId,
        courseName: cls.course.name,
        category: cls.course.category,
        instructorName: cls.instructor ? cls.instructor.name : "Unassigned",
        schedule: cls.schedule,
        capacity: cls.capacity,
        currentStudents: cls.enrollments?.length || 0,
    }));
}

export async function registerStudent(studentId, classId, courseId) {
    const targetClass = await prisma.class.findUnique({
        where: {
            id_courseId: { id: classId, courseId: courseId }
        },
        include: {
            course: {
                include: {
                    prerequisites: true
                }
            },
            enrollments: true
        }
    });

    if (!targetClass) {
        throw new Error("Class not found");
    }

    if (targetClass.enrollments.length >= targetClass.capacity) {
        throw new Error("Class is full");
    }

    const prerequisites = targetClass.course.prerequisites;

    const studentEnrollments = await prisma.enrollment.findMany({
        where: {
            studentId: studentId
        },
        include: {
            class: {
                include: {
                    course: true
                }
            }
        }
    });

    const completedCourses = new Set(
        studentEnrollments.map(e => e.class.course.id)
    );

    const missingPrereqs = prerequisites.filter(prereq => !completedCourses.has(prereq.id));

    if (missingPrereqs.length > 0) {
        throw new Error("Missing prerequisites: " + missingPrereqs.map(c => c.name).join(", "));
    }

    await prisma.enrollment.create({
        data: {
            studentId: studentId,
            classId: classId,
            courseId: courseId
        }
    });

    return { message: "Registration successful!" };
}