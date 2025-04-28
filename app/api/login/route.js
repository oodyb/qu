import * as users from "@/repos/users.js";

export async function POST(request) {
  const { username, password } = await request.json();

  const user = await users.findUserByUsername(username);

  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }

  if (user.password !== password) {
    return Response.json({ message: "Invalid password" }, { status: 401 });
  }

  return Response.json(user);
}