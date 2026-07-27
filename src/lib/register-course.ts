import { createServerFn } from "@tanstack/react-start";
import crypto from "crypto";

const COURSE_SLUG = "uloom-ul-quran";

export const registerForCourse = createServerFn({ method: "POST" })
  .validator(
    (input: {
      fullNameEn: string;
      fullNameUr: string;
      email: string;
      password?: string;
      age: string;
      phoneNumber: string;
      education: string;
      islamicEducation: string;
      scholarsListenedTo: string;
      howHeard: string;
      completedLevel1: boolean;
      promiseToParticipate: boolean;
    }) => input,
  )
  .handler(async ({ data: input }) => {
    if (!input) throw new Error("Invalid registration request");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin.auth.admin.getUserByEmail(input.email);
    const existingUser = existing?.user;

    let userId: string;
    let rollNumber: string;

    if (existingUser) {
      userId = existingUser.id;
      const existingMeta = existingUser.user_metadata ?? {};
      rollNumber = (existingMeta.roll_number as string) ?? "";
    } else {
      const pw = input.password || crypto.randomUUID();
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: input.email,
        password: pw,
        email_confirm: true,
        user_metadata: { full_name: input.fullNameEn },
      });

      if (createError) throw new Error(createError.message);
      if (!userData?.user) throw new Error("Failed to create user");

      userId = userData.user.id;
    }

    if (!rollNumber) {
      const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers();
      let maxRoll = 3030000;
      for (const u of allUsers?.users ?? []) {
        const rn = u.user_metadata?.roll_number as string | undefined;
        if (rn) {
          const num = parseInt(rn, 10);
          if (!isNaN(num) && num > maxRoll) maxRoll = num;
        }
      }
      rollNumber = String(maxRoll + 1);
    }

    const currentMeta = existingUser?.user_metadata ?? {};
    const enrolled: string[] = currentMeta.enrolled_courses ?? [];

    if (!enrolled.includes(COURSE_SLUG)) {
      enrolled.push(COURSE_SLUG);
    }

    const { error: metaError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...currentMeta,
        full_name: input.fullNameEn,
        roll_number: rollNumber,
        enrolled_courses: enrolled,
        reg_name_ur: input.fullNameUr,
        reg_age: input.age,
        reg_phone: input.phoneNumber,
        reg_education: input.education,
        reg_islamic_education: input.islamicEducation,
        reg_scholars: input.scholarsListenedTo,
        reg_how_heard: input.howHeard,
        reg_completed_level_1: input.completedLevel1,
        reg_promise: input.promiseToParticipate,
        reg_course: COURSE_SLUG,
      },
    });

    if (metaError) throw new Error("Failed to update user metadata");

    return { rollNumber, email: input.email };
  });
