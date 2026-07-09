import { createFileRoute, useNavigate, useSearch, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  beforeLoad: async ({ search }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (data.session) throw redirect({ to: search.redirect ?? "/" });
  },
  component: AuthPage,
});

function AuthPage() {
  const search = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  async function afterAuth() {
    navigate({ to: search.redirect ?? "/", replace: true });
  }

  async function signIn() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("As-salāmu ʿalaykum. Welcome back.");
    await afterAuth();
  }

  async function signUp() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. You may now sign in.");
  }

  async function signInGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) return toast.error(result.error.message ?? "Sign-in failed");
    if (result.redirected) return;
    await afterAuth();
  }

  return (
    <div className="min-h-screen grid place-items-center px-6 py-12 bg-parchment">
      <Card className="w-full max-w-md p-8 shadow-scholarly">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-scholarly mb-4">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="text-xs uppercase tracking-[0.25em] text-gold ornament">Nūr al-ʿIlm</div>
          <h1 className="mt-2 font-serif text-3xl text-primary">Enter the halaqah</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to access the lectures and notes.</p>
        </div>

        <Button variant="outline" className="w-full" onClick={signInGoogle}>
          Continue with Google
        </Button>
        <div className="flex items-center gap-3 my-5 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" />
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="space-y-3 mt-4">
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button className="w-full" onClick={signIn} disabled={loading}>Sign in</Button>
          </TabsContent>
          <TabsContent value="signup" className="space-y-3 mt-4">
            <div><Label>Full name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} /></div>
            <Button className="w-full" onClick={signUp} disabled={loading}>Create account</Button>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
