import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AuthState = {
  loading: boolean;
  user: User | null;
  isAdmin: boolean;
};

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ loading: true, user: null, isAdmin: false });

  useEffect(() => {
    let mounted = true;

    async function loadRole(user: User | null) {
      if (!user) return false;
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      return !!data;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user ?? null;
      const isAdmin = await loadRole(user);
      if (mounted) setState({ loading: false, user, isAdmin });
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED" && event !== "INITIAL_SESSION") return;
      const user = session?.user ?? null;
      const isAdmin = await loadRole(user);
      if (mounted) setState({ loading: false, user, isAdmin });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
