import { createServerFn } from "@tanstack/react-start";

const ROLL_MIN = 3030000;
const ROLL_MAX = 3099999;

export const getNextRollNumber = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  let roll: number;
  let isTaken = true;
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops just in case

  while (isTaken && attempts < maxAttempts) {
    roll = ROLL_MIN + Math.floor(Math.random() * (ROLL_MAX - ROLL_MIN + 1));

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("roll_number", String(roll))
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Database error while checking roll number: ${error.message}`);
    }

    if (!data) {
      isTaken = false;
    }
    attempts++;
  }

  if (isTaken) {
    throw new Error("Failed to find an available roll number after multiple attempts");
  }

  return String(roll!);
});
