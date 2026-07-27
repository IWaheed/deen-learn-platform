import { createServerFn } from "@tanstack/react-start";

const GATED_SLUGS = ["quranic-sciences-zamzami", "uloom-ul-quran"];

export const enrollInCourse = createServerFn({ method: "POST" })
  .validator((input: { courseSlug: string; rollNumber: string; userId: string }) => input)
  .handler(async ({ data: { courseSlug, rollNumber, userId } }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (!GATED_SLUGS.includes(courseSlug))
      throw new Error("This course does not require enrollment");

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (userError || !userData) throw new Error("User not found");

    const meta = userData.user.user_metadata ?? {};

    const userRollNumber = meta.roll_number as string | undefined;
    if (!userRollNumber) throw new Error("No roll number found. Please register first.");
    if (userRollNumber !== rollNumber) throw new Error("Roll number does not match your account");

    const enrolled: string[] = meta.enrolled_courses ?? [];
    if (enrolled.includes(courseSlug)) throw new Error("Already enrolled in this course");

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: { ...meta, enrolled_courses: [...enrolled, courseSlug] },
    });
    if (updateError) throw new Error("Failed to enroll");

    return { success: true };
  });
