import { createClass } from "@/repos/admin";

export async function POST(request) {
  try {
    const data = await request.json();
    const newClass = await createClass(data);
    return Response.json(newClass, { status: 201 });
  } catch (err) {
    console.error("CREATE CLASS ERROR:", err);
    return Response.json({ error: "Failed to create class" }, { status: 500 });
  }
}