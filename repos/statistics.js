import prisma from "@/repos/prisma";

// 1. Grade distribution
export async function getGradeDistribution() {
    return await prisma.enrollment.groupBy({
        by: ['grade'],
        _count: {
            grade: true,
        },
    });
}

// 2. Eenrollments per course
export async function getCoursePopularity() {
    return await prisma.enrollment.groupBy({
        by: ['courseId'],
        _count: {
            courseId: true,
        },
    });
}

// 3. Class status distribution
export async function getClassStatusDistribution() {
    return await prisma.class.groupBy({
        by: ['status'],
        _count: {
            status: true,
        },
    });
}

// 4. Nnumber of classes per instructor
export async function getInstructorLoad() {
    return await prisma.class.groupBy({
        by: ['instructorId'],
        _count: {
            instructorId: true,
        },
        where: {
            instructorId: {
                not: null,
            },
        },
    });
}

// 5. Class capacity vs current enrollment
export async function getClassCapacityVsEnrollment() {
    const classes = await prisma.class.findMany({
        include: {
            enrollments: true,
        },
    });

    return classes.map(cls => ({
        classId: cls.id,
        courseId: cls.courseId,
        capacity: cls.capacity,
        enrolled: cls.enrollments.length,
    }));
}

// 6. Course categories distribution
export async function getCourseCategoryDistribution() {
    const courses = await prisma.course.findMany();
    const categoryCount = {};

    for (const course of courses) {
        const categories = Array.isArray(course.category) ? course.category : [course.category];
        for (const cat of categories) {
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
        }
    }

    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
}

// 7. Preferences per course
export async function getPreferencesPerCourse() {
    return await prisma.preference.groupBy({
        by: ['courseId'],
        _count: {
            courseId: true,
        },
    });
}

// 8. Students per instructor
export async function getStudentsPerInstructor() {
    const classes = await prisma.class.findMany({
        include: {
            enrollments: true,
        },
        where: {
            instructorId: {
                not: null,
            },
        },
    });

    const instructorStudentCount = {};

    for (const cls of classes) {
        if (!cls.instructorId) continue;
        instructorStudentCount[cls.instructorId] = (instructorStudentCount[cls.instructorId] || 0) + cls.enrollments.length;
    }

    return Object.entries(instructorStudentCount).map(([instructorId, studentCount]) => ({
        instructorId: parseInt(instructorId),
        studentCount,
    }));
}

// 9. Courses With and Without Classes
export async function getCoursesWithAndWithoutClasses() {
    const courses = await prisma.course.findMany({
        include: {
            classes: true,
        },
    });

    let withClasses = 0;
    let withoutClasses = 0;

    for (const course of courses) {
        if (course.classes.length > 0) {
            withClasses++;
        } else {
            withoutClasses++;
        }
    }

    return [
        { name: "With Classes", value: withClasses },
        { name: "Without Classes", value: withoutClasses },
    ];
}

// 10. Class sizes per course
export async function getClassSizesPerCourse() {
    const classes = await prisma.class.findMany({
        include: {
            enrollments: true,
            course: true,
        },
    });

    return classes.map(cls => ({
        courseName: cls.course.name,
        classId: cls.id,
        enrolledStudents: cls.enrollments.length,
        capacity: cls.capacity,
    }));
}
