import { createServerFn } from "@tanstack/react-start";

export const signUpUser = createServerFn({ method: "POST" })
  .validator(
    (input: { email: string; password: string; fullName: string; rollNumber: string }) => input,
  )
  .handler(async ({ data }) => {
    if (!data) throw new Error("Invalid signup request");
    const { email, password, fullName, rollNumber } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers?.users.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );
    if (existing) throw new Error("An account with this email already exists");

    const { error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, roll_number: rollNumber },
    });

    if (error) throw new Error(error.message);

    return { success: true };
  });
