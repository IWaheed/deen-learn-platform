import { createFileRoute, useNavigate, useSearch, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { getNextRollNumber } from "@/lib/roll-number";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/spinner";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Deen Learn Platform" },
      { name: "description", content: "Sign in or create an account to access Islamic studies courses." },
    ],
  }),
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
  const [view, setView] = useState<"signin" | "signup" | "forgot" | "reset">("signin");
  const [newPassword, setNewPassword] = useState("");
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [rollNumber, setRollNumber] = useState("");

  function passwordScore(pw: string): { label: string; color: string; pct: number } {
    let score = 0;
    if (pw.length >= 6) score += 20;
    if (pw.length >= 10) score += 15;
    if (/[a-z]/.test(pw)) score += 15;
    if (/[A-Z]/.test(pw)) score += 15;
    if (/[0-9]/.test(pw)) score += 15;
    if (/[^a-zA-Z0-9]/.test(pw)) score += 20;
    if (score < 30) return { label: "Weak", color: "bg-destructive", pct: Math.max(score, 5) };
    if (score < 60) return { label: "Fair", color: "bg-amber-500", pct: score };
    if (score < 80) return { label: "Good", color: "bg-yellow-600", pct: score };
    return { label: "Strong", color: "bg-emerald-600", pct: score };
  }

  const strength = passwordScore(password);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setView("reset");
    });
    return () => sub.subscription.unsubscribe();
  }, []);

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
    let roll: string | undefined;
    try {
      roll = await getNextRollNumber();
    } catch {
      return toast.error("Failed to generate roll number. Please try again.");
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName, roll_number: roll },
      },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setRollNumber(roll);
    setShowVerifyDialog(true);
  }

  async function signInGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) return toast.error(result.error.message ?? "Sign-in failed");
    if (result.redirected) return;
    await afterAuth();
  }

  async function forgotPassword() {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Check your email for a password reset link.");
    setView("signin");
  }

  async function updatePassword() {
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated successfully. You may now sign in.");
    setView("signin");
    setNewPassword("");
  }

  return (
    <div className="min-h-screen grid place-items-center px-6 py-12 bg-parchment">
      <AlertDialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration successful</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>We sent a verification link to <strong>{email}</strong>. Please verify your email, then sign in.</p>
                <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Your roll number</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-primary">{rollNumber}</p>
                </div>
                <p className="text-xs text-muted-foreground">Keep this number for your records.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowVerifyDialog(false)}>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Card className="w-full max-w-md p-8 shadow-scholarly">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-scholarly mb-4">
            <BookOpen className="h-5 w-5" />
          </div>
          <div className="text-xs uppercase tracking-[0.25em] text-gold ornament">Deen Learn Platform</div>
          <h1 className="mt-2 font-serif text-3xl text-primary">Enter the halaqah</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to access the lectures and notes.</p>
        </div>

        {view === "reset" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Enter your new password below.</p>
            <div>
              <Label>New password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={6} />
            </div>
            <Button className="w-full" onClick={updatePassword} disabled={loading}>
              {loading ? <Spinner className="h-4 w-4" /> : null}
              {loading ? "Updating..." : "Update password"}
            </Button>
          </div>
        ) : view === "forgot" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button className="w-full" onClick={forgotPassword} disabled={loading}>
              {loading ? <Spinner className="h-4 w-4" /> : null}
              {loading ? "Sending..." : "Send reset link"}
            </Button>
            <button className="text-xs text-muted-foreground hover:underline mx-auto block" onClick={() => setView("signin")}>
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            <Button variant="outline" className="w-full" onClick={signInGoogle} disabled={loading}>
              Continue with Google
            </Button>
            <div className="flex items-center gap-3 my-5 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" />
            </div>

            <Tabs value={view} onValueChange={(v) => setView(v as "signin" | "signup")}>
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="signin" className="space-y-3 mt-4">
                <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
                <Button className="w-full" onClick={signIn} disabled={loading}>
                  {loading ? <Spinner className="h-4 w-4" /> : null}
                  Sign in
                </Button>
                <button className="text-xs text-muted-foreground hover:underline mx-auto block" onClick={() => setView("forgot")}>
                  Forgot password?
                </button>
              </TabsContent>
              <TabsContent value="signup" className="space-y-3 mt-4">
                <div><Label>Full name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} /></div>
                <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
                  {password && (
                    <div className="mt-2">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div className={`h-full ${strength.color} transition-all duration-300 rounded-full`} style={{ width: `${strength.pct}%` }} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{strength.label}</p>
                    </div>
                  )}
                </div>
                <Button className="w-full" onClick={signUp} disabled={loading}>
                  {loading ? <Spinner className="h-4 w-4" /> : null}
                  Create account
                </Button>
              </TabsContent>
            </Tabs>
          </>
        )}
      </Card>
    </div>
  );
}
