import { PrismaClient } from './client/index.js';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seed.js');

  // 1. Load JSON data
  const users = JSON.parse(await fs.readFile(path.join(process.cwd(), 'prisma', 'seed-data', 'users.json')));
  const courses = JSON.parse(await fs.readFile(path.join(process.cwd(), 'prisma', 'seed-data', 'courses.json')));
  const classes = JSON.parse(await fs.readFile(path.join(process.cwd(), 'prisma', 'seed-data', 'classes.json')));
  const enrollments = JSON.parse(await fs.readFile(path.join(process.cwd(), 'prisma', 'seed-data', 'enrollments.json')));

  // 2. Delete existing data first (order matters!)
  await prisma.enrollment.deleteMany();
  await prisma.class.deleteMany();
  await prisma.preference.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // 3. Insert users
  await prisma.user.createMany({ data: users });
  console.log(`Inserted ${users.length} users`);

  // 4. Insert courses
  await prisma.course.createMany({ data: courses });
  console.log(`Inserted ${courses.length} courses`);

  // 5. Insert classes
  await Promise.all(
    classes.map(cls =>
      prisma.class.create({
        data: {
          id: cls.id,
          courseId: cls.courseId,
          instructorId: cls.instructorId,
          capacity: cls.capacity,
          schedule: cls.schedule,
          status: cls.status,
        }
      })
    )
  );
  console.log(`Inserted ${classes.length} classes`);

  // 6. Insert enrollments
  await prisma.enrollment.createMany({ data: enrollments });
  console.log(`Inserted ${enrollments.length} enrollments`);

  console.log(`Finished seed.js`)
}

main()
  .catch((e) => {
    console.error('Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });