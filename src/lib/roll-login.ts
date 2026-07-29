import { createServerFn } from "@tanstack/react-start";

const ALLOWED_COURSE = "uloom-ul-quran";

export const loginWithRollNumber = createServerFn({ method: "POST" })
  .validator((input: { rollNumber: string; email: string }) => input)
  .handler(async ({ data }) => {
    if (!data) throw new Error("Invalid login request");
    const { rollNumber, email } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: users } = await supabaseAdmin.auth.admin.listUsers({ perPage: 10000 });

    const match = users?.users.find((u) => {
      const meta = u.user_metadata ?? {};
      return meta.roll_number === rollNumber && u.email?.toLowerCase() === email.toLowerCase();
    });

    if (!match) {
      return { valid: false };
    }

    const enrolled: string[] = (match.user_metadata?.enrolled_courses as string[]) ?? [];
    if (!enrolled.includes(ALLOWED_COURSE)) {
      return { valid: false };
    }

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });

    if (linkError || !linkData?.properties?.action_link) throw new Error("Login failed");

    const url = new URL(linkData.properties.action_link);
    const token = url.searchParams.get("token");
    if (!token) throw new Error("Login failed");

    return {
      valid: true,
      token,
      email,
    };
  });
