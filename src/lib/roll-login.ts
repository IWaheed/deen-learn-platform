import { createServerFn } from "@tanstack/react-start";

const ALLOWED_COURSE = "uloom-ul-quran";

export const loginWithRollNumber = createServerFn({ method: "POST" })
  .validator((input: { rollNumber: string; email: string }) => input)
  .handler(async ({ data }) => {
    if (!data) throw new Error("Invalid login request");
    const { rollNumber, email } = data;
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Rate limiting: max 5 requests per 15 minutes (900 seconds) per email (username)
    const rateLimitIdentifier = `login_${email.toLowerCase()}`;
    const { data: isAllowed, error: rateLimitError } = await supabaseAdmin.rpc('check_rate_limit', {
      p_identifier: rateLimitIdentifier,
      p_max_requests: 5,
      p_window_seconds: 900
    });

    if (rateLimitError) {
      console.error("Rate limit error:", rateLimitError);
    } else if (!isAllowed) {
      throw new Error("Too many login attempts. Please try again later.");
    }

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
