import { rejectPreference } from "@/repos/admin";

export async function POST(req) {
  try {
    const { preferenceId } = await req.json();
    await rejectPreference(preferenceId);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: "Failed to reject preference" }, { status: 500 });
  }
}