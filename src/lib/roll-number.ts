import { createServerFn } from "@tanstack/react-start";

const ROLL_MIN = 3030000;
const ROLL_MAX = 3099999;

export const getNextRollNumber = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: nextRoll, error: rpcError } = await supabaseAdmin.rpc("next_roll_number");

  if (rpcError) {
    throw new Error(`Failed to generate roll number: ${rpcError.message}`);
  }

  if (!nextRoll) {
    throw new Error("No available roll numbers");
  }

  return String(nextRoll);
});
