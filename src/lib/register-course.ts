import { createServerFn } from "@tanstack/react-start";
import crypto from "crypto";

const COURSE_SLUG = "uloom-ul-quran";

export const registerForCourse = createServerFn({ method: "POST" })
  .validator(
    (input: {
      fullNameEn: string;
      fullNameUr: string;
      gender: string;
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

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 10000 });
    const existingUser =
      existingUsers?.users.find((u) => u.email?.toLowerCase() === input.email.toLowerCase()) ??
      null;

    let userId: string;
    let rollNumber: string = "";

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
      const ROLL_MIN = 3030000;
      const ROLL_MAX = 3099999;

      const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 10000 });
      const taken = new Set<number>();
      for (const u of allUsers?.users ?? []) {
        const rn = u.user_metadata?.roll_number as string | undefined;
        if (rn) {
          const num = parseInt(rn, 10);
          if (!isNaN(num)) taken.add(num);
        }
      }

      if (taken.size >= ROLL_MAX - ROLL_MIN + 1) {
        throw new Error("No available roll numbers");
      }

      let roll: number;
      do {
        roll = ROLL_MIN + Math.floor(Math.random() * (ROLL_MAX - ROLL_MIN + 1));
      } while (taken.has(roll));

      rollNumber = String(roll);
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
        reg_gender: input.gender,
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
