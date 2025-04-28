
import prisma from "@/repos/prisma";

export async function findUserByUsername(username) {
  return await prisma.user.findUnique({ where: { username } });
}

export async function findUserById(id) {
  return await prisma.user.findUnique({ where: { id } });
}

export async function createUser(userData) {
  return await prisma.user.create({
    data: {
      id: userData.id,
      username: userData.username,
      password: "123",
      name: userData.name,
      role: userData.role,
    },
  });
}