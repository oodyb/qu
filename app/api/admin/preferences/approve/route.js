import { approvePreference, rejectPreference } from "@/repos/admin";

export async function POST(req) {
  try {
    const { preferenceId, classId, courseId } = await req.json();

    await approvePreference(preferenceId, classId, courseId);
    await rejectPreference(preferenceId);

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to approve preference" }, { status: 500 });
  }
}