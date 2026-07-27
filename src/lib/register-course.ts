import { createServerFn } from "@tanstack/react-start";

const COURSE_SLUG = "uloome-ul-quran";

export const registerForCourse = createServerFn({ method: "POST" })
  .validator(
    (input: {
      fullNameEn: string;
      fullNameUr: string;
      email: string;
      password: string;
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
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existing } = await supabaseAdmin.auth.admin.getUserByEmail(data.email);
    const existingUser = existing?.user;

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      await supabaseAdmin.auth.admin.updateUserById(userId, { password: data.password });
    } else {
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { full_name: data.fullNameEn },
      });

      if (createError) throw new Error(createError.message);
      if (!userData?.user) throw new Error("Failed to create user");

      userId = userData.user.id;
    }

    const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers();
    let maxRoll = 3030000;
    for (const u of allUsers?.users ?? []) {
      const rn = u.user_metadata?.roll_number as string | undefined;
      if (rn) {
        const num = parseInt(rn, 10);
        if (!isNaN(num) && num > maxRoll) maxRoll = num;
      }
    }
    const nextRoll = String(maxRoll + 1);

    const currentMeta = existingUser?.user_metadata ?? {};
    const enrolled: string[] = currentMeta.enrolled_courses ?? [];

    if (!enrolled.includes(COURSE_SLUG)) {
      enrolled.push(COURSE_SLUG);
    }

    const { error: metaError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        ...currentMeta,
        full_name: data.fullNameEn,
        roll_number: nextRoll,
        enrolled_courses: enrolled,
        reg_name_ur: data.fullNameUr,
        reg_age: data.age,
        reg_phone: data.phoneNumber,
        reg_education: data.education,
        reg_islamic_education: data.islamicEducation,
        reg_scholars: data.scholarsListenedTo,
        reg_how_heard: data.howHeard,
        reg_completed_level_1: data.completedLevel1,
        reg_promise: data.promiseToParticipate,
        reg_course: COURSE_SLUG,
      },
    });

    if (metaError) throw new Error("Failed to update user metadata");

    return { rollNumber: nextRoll, email: data.email };
  });
