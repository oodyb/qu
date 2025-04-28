// prisma/generate-seed.js
import { faker } from '@faker-js/faker';
import fs from 'fs/promises';
import path from 'path';

const ROLES = { STUDENT: 'STUDENT', INSTRUCTOR: 'INSTRUCTOR', ADMIN: 'ADMIN' };

const courseNames = [
  "Introduction to Programming",
  "Data Structures and Algorithms",
  "Database Systems",
  "Operating Systems",
  "Computer Networks",
  "Artificial Intelligence",
  "Software Engineering Principles",
  "Cybersecurity Fundamentals",
  "Web Application Development",
  "Cloud Computing",
  "Machine Learning Basics",
  "Mobile App Development",
  "Project Management",
  "Ethical Hacking",
  "Advanced Java Programming",
  "Computer Graphics",
  "Big Data Analytics",
  "Embedded Systems",
  "Blockchain Technology",
  "Natural Language Processing"
];

async function generateSeedData() {
  const users = [];
  const courses = [];
  const classes = [];
  const enrollments = [];

  // 1. Generate users
  const totalStudents = 450;
  const totalInstructors = 48;
  const totalAdmins = 2;
  let currentId = 201800000;

  for (let i = 0; i < totalStudents; i++) {
    users.push({
      id: currentId++,
      name: faker.person.fullName(),
      username: faker.internet.userName().substring(0, 3).toLowerCase() + i,
      password: '123',
      role: ROLES.STUDENT
    });
  }

  for (let i = 0; i < totalInstructors; i++) {
    users.push({
      id: currentId++,
      name: faker.person.fullName(),
      username: faker.internet.userName().substring(0, 3).toLowerCase() + (i + totalStudents),
      password: '123',
      role: ROLES.INSTRUCTOR
    });
  }

  for (let i = 0; i < totalAdmins; i++) {
    users.push({
      id: currentId++,
      name: faker.person.fullName(),
      username: faker.internet.userName().substring(0, 3).toLowerCase() + (i + totalStudents + totalInstructors),
      password: '123',
      role: ROLES.ADMIN
    });
  }

  // 2. Generate courses
  const nameCounts = {};

  for (let i = 1; i <= 50; i++) {
    let baseName = faker.helpers.arrayElement(courseNames);

    // Check if name has been used before
    if (nameCounts[baseName]) {
      nameCounts[baseName]++;
      // Add Roman numeral based on count
      const romanNumerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
      baseName += ` ${romanNumerals[nameCounts[baseName] - 1] || nameCounts[baseName]}`;
    } else {
      nameCounts[baseName] = 1;
    }
    const minStudents = faker.number.int({ min: 5, max: 20 });
    const maxStudents = faker.number.int({ min: minStudents + 5, max: 40 });
    courses.push({
      id: `CMPS${300 + i}`,
      name: baseName,
      category: [faker.helpers.arrayElement(['Programming', 'Computing Systems', 'Software Engineering', 'Security', 'Project'])],
      description: faker.lorem.sentence(),
      creditHours: faker.number.int({ min: 1, max: 4 }),
      minStudents,
      maxStudents
    });
  }

  // 3. Generate classes
  let classCounter = 1;
  const instructorIds = users.filter(u => u.role === ROLES.INSTRUCTOR).map(u => u.id);
  for (let course of courses) {
    const daysOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
    const randomDays = faker.helpers.arrayElements(
      daysOptions,
      faker.number.int({ min: 2, max: 3 })
    );

    for (let j = 0; j < 5; j++) {
      const randomHour = faker.number.int({ min: 8, max: 17 });
      const startTime = `${randomHour.toString().padStart(2, '0')}:00`;
      const endTime = `${randomHour.toString().padStart(2, '0')}:50`;
      const randomInstructor = Math.random() < 0.8 // 80% chance to assign
        ? faker.helpers.arrayElement(instructorIds)
        : null;

      classes.push({
        id: `L${classCounter.toString().padStart(3, '0')}`,
        courseId: course.id,
        instructorId: randomInstructor,
        capacity: faker.number.int({ min: 10, max: 30 }),
        schedule: {
          day: randomDays,
          time: `${startTime} - ${endTime}`,
          room: `${faker.helpers.arrayElement(['A', 'B', 'C'])}${faker.number.int({ min: 100, max: 399 })}`
        },
        status: faker.helpers.weightedArrayElement([
          { weight: 20, value: 'OPEN' },
          { weight: 60, value: 'IN_PROGRESS' },
          { weight: 20, value: 'COMPLETED' },
        ])
      });
      classCounter++;
    }
  }

  // 4. Generate enrollments
  const studentIds = users.filter(u => u.role === ROLES.STUDENT).map(u => u.id);
  const classIds = classes.map(c => ({ id: c.id, courseId: c.courseId }));

  for (let studentId of studentIds) {
    if (Math.random() < 0.85) { // 85% students have enrollments
      const enrolledClasses = faker.helpers.arrayElements(classIds, faker.number.int({ min: 1, max: 4 }));
      for (let cls of enrolledClasses) {
        // Find the full class data
        const classObj = classes.find(c => c.id === cls.id);
        let grade = null;

        if (classObj && classObj.status === "COMPLETED") {
          // Only if class is completed, assign random grade
          grade = faker.helpers.arrayElement(["A", "B+", "B", "C+", "C", "D+", "D", "F"]);
        }

        enrollments.push({
          studentId,
          classId: cls.id,
          courseId: cls.courseId,
          grade
        });
      }
    }
  }

  // 5. Write files
  await fs.mkdir(path.join(process.cwd(), 'prisma', 'seed-data'), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), 'prisma', 'seed-data', 'users.json'), JSON.stringify(users, null, 2));
  await fs.writeFile(path.join(process.cwd(), 'prisma', 'seed-data', 'courses.json'), JSON.stringify(courses, null, 2));
  await fs.writeFile(path.join(process.cwd(), 'prisma', 'seed-data', 'classes.json'), JSON.stringify(classes, null, 2));
  await fs.writeFile(path.join(process.cwd(), 'prisma', 'seed-data', 'enrollments.json'), JSON.stringify(enrollments, null, 2));

  console.log('Data generated inside prisma/seed-data folder');
}

await generateSeedData();