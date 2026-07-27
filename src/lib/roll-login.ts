import { createServerFn } from "@tanstack/react-start";

const ALLOWED_COURSE = "uloome-ul-quran";

export const loginWithRollNumber = createServerFn({ method: "POST" })
  .validator((input: { rollNumber: string; email: string }) => input)
  .handler(async ({ data: { rollNumber, email } }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data } = await supabaseAdmin.auth.admin.listUsers();

    const match = data?.users.find((u) => {
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

    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY!;

    const linkRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/generate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "magiclink", email }),
    });

    if (!linkRes.ok) throw new Error("Login failed");

    const linkData = await linkRes.json();
    const actionLink = linkData.properties?.action_link as string;
    if (!actionLink) throw new Error("Login failed");

    const url = new URL(actionLink);
    const token = url.searchParams.get("token");
    if (!token) throw new Error("Login failed");

    const verifyRes = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "magiclink", token, email }),
    });

    if (!verifyRes.ok) throw new Error("Login failed");

    const session = await verifyRes.json();

    return {
      valid: true,
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    };
  });
