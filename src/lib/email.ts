import { createServerFn } from "@tanstack/react-start";

export const sendRollNumberEmail = createServerFn({ method: "POST" })
  .validator((input: { email: string; fullName: string; rollNumber: string }) => input)
  .handler(async ({ data: { email, fullName, rollNumber } }) => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.warn("[email] RESEND_API_KEY not set — skipping email");
      return { sent: false };
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Deen Learn Platform <noreply@deenlearnplatform.com>",
        to: email,
        subject: "Your Student ID — Deen Learn Platform",
        html: `
          <div style="font-family: 'Georgia', serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #faf8f4;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="font-size: 10px; letter-spacing: 0.25em; color: #b8944b; text-transform: uppercase;">Deen Learn Platform</div>
              <h1 style="font-size: 22px; color: #1a3a2a; margin: 8px 0 0;">As-salāmu ʿalaykum, ${fullName}</h1>
            </div>
            <p style="color: #4a5a4a; font-size: 15px; line-height: 1.6;">Your account has been created. Below is your Student ID — keep it for course enrollment.</p>
            <div style="background: white; border: 1px solid #e0d8c8; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <p style="font-size: 11px; color: #8a9a8a; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 6px;">Student ID</p>
              <p style="font-family: 'Courier New', monospace; font-size: 28px; font-weight: 700; color: #1a3a2a; margin: 0; letter-spacing: 2px;">${rollNumber}</p>
            </div>
            <p style="color: #8a9a8a; font-size: 12px; line-height: 1.5;">You will need this ID to enroll in gated courses. Please verify your email before signing in.</p>
            <hr style="border: none; border-top: 1px solid #e0d8c8; margin: 24px 0;">
            <p style="color: #aabaaa; font-size: 11px; text-align: center;">Deen Learn Platform — Islamic Studies</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] Failed to send: ${res.status} ${body}`);
      return { sent: false };
    }

    return { sent: true };
  });
