import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BookOpen, ArrowLeft, Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/spinner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { registerForCourse } from "@/lib/register-course";

export const Route = createFileRoute("/register-course")({
  component: RegisterCoursePage,
  head: () => ({
    meta: [
      {
        title: "Register — Uloom ul-Quran — Deen Learn Platform",
      },
    ],
  }),
});

function RegisterCoursePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [resultRoll, setResultRoll] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <SiteHeader />
      <SuccessDialog
        showSuccess={showSuccess}
        setShowSuccess={setShowSuccess}
        resultRoll={resultRoll}
      />

      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="text-center mb-10">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto mb-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="text-xs uppercase tracking-[0.25em] text-gold ornament">Registration</div>
          <h1 className="mt-3 font-serif text-3xl text-primary">Mafateeh Al-Talab Level 2</h1>
          <p className="mt-2 text-muted-foreground text-sm max-w-lg mx-auto">
            Qur&apos;anic Sciences &amp; Principles of Interpreting the Qur&apos;an (Uloom ul-Quran)
          </p>
          <p className="mt-1 text-xs text-gold">Instructor: Ustadh Irtaza Waheed</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Class Days: Saturday &amp; Sunday &middot; Time: 1:30 PM (PKT)
          </p>
        </div>

        <RegistrationForm setShowSuccess={setShowSuccess} setResultRoll={setResultRoll} />

        <p className="text-xs text-muted-foreground text-center mt-6">
          By registering, you agree to participate actively in the course.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function SuccessDialog({
  showSuccess,
  setShowSuccess,
  resultRoll,
}: {
  showSuccess: boolean;
  setShowSuccess: (show: boolean) => void;
  resultRoll: string;
}) {
  return (
    <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Registration successful</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>Your account has been created. Your Student ID is shown below.</p>
              <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Your Student ID
                </p>
                <p className="mt-1 font-mono text-2xl font-bold text-primary">{resultRoll}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Keep this number. You can now sign in with your email and password.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Link to="/auth">Go to sign in</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RegistrationForm({
  setShowSuccess,
  setResultRoll,
}: {
  setShowSuccess: (show: boolean) => void;
  setResultRoll: (roll: string) => void;
}) {
  const [fullNameEn, setFullNameEn] = useState("");
  const [fullNameUr, setFullNameUr] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [education, setEducation] = useState("");
  const [islamicEducation, setIslamicEducation] = useState("");
  const [scholarsListenedTo, setScholarsListenedTo] = useState("");
  const [howHeard, setHowHeard] = useState("");
  const [completedLevel1, setCompletedLevel1] = useState<boolean | null>(null);
  const [promiseToParticipate, setPromiseToParticipate] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullNameEn.trim()) return toast.error("Full name in English is required");
    if (!fullNameUr.trim()) return toast.error("Full name in Urdu is required");
    if (!gender) return toast.error("Gender is required");
    if (!email.trim()) return toast.error("Email is required");
    if (password && password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (!age.trim()) return toast.error("Age is required");
    if (!phoneNumber.trim()) return toast.error("Phone number is required");
    if (!education.trim()) return toast.error("Education is required");
    if (!islamicEducation.trim()) return toast.error("Islamic education is required");
    if (!scholarsListenedTo.trim()) return toast.error("This field is required");
    if (!howHeard.trim()) return toast.error("This field is required");
    if (completedLevel1 === null) return toast.error("Please answer this question");
    if (!promiseToParticipate) return toast.error("You must agree to participate till the end");

    setLoading(true);
    try {
      const result = await registerForCourse({
        data: {
          fullNameEn: fullNameEn.trim(),
          fullNameUr: fullNameUr.trim(),
          gender,
          email: email.trim(),
          password: password.trim(),
          age: age.trim(),
          phoneNumber: phoneNumber.trim(),
          education: education.trim(),
          islamicEducation: islamicEducation.trim(),
          scholarsListenedTo: scholarsListenedTo.trim(),
          howHeard: howHeard.trim(),
          completedLevel1,
          promiseToParticipate,
        },
      });
      setResultRoll(result.rollNumber);
      setShowSuccess(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 md:p-8 shadow-scholarly">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Full Name (In English)" required>
          <Input
            value={fullNameEn}
            onChange={(e) => setFullNameEn(e.target.value)}
            placeholder="e.g. Muhammad Ahmad"
          />
        </Field>

        <Field label="Full Name (In Urdu)" required>
          <Input
            value={fullNameUr}
            onChange={(e) => setFullNameUr(e.target.value)}
            placeholder="نام اردو میں (مثال: محمد احمد)"
            dir="rtl"
            className="text-right font-urdu"
          />
        </Field>

        <Field label="Gender" required>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setGender("Male")}
              className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                gender === "Male"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <Check
                className={`h-4 w-4 inline mr-1.5 ${
                  gender === "Male" ? "opacity-100" : "opacity-0"
                }`}
              />
              Male
            </button>
            <button
              type="button"
              onClick={() => setGender("Female")}
              className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                gender === "Female"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <Check
                className={`h-4 w-4 inline mr-1.5 ${
                  gender === "Female" ? "opacity-100" : "opacity-0"
                }`}
              />
              Female
            </button>
          </div>
        </Field>

        <Field label="Email" required>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </Field>

        <Field label="Password" required>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            placeholder="At least 6 characters"
          />
        </Field>

        <Field label="Age" required>
          <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 25" />
        </Field>

        <Field label="Phone Number" required>
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g. +92 300 1234567"
          />
        </Field>

        <Field label="Education (e.g. BSc Mathematics)" required>
          <Input
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="e.g. BSc Mathematics"
          />
        </Field>

        <Field label="Islamic Education" required>
          <Input
            value={islamicEducation}
            onChange={(e) => setIslamicEducation(e.target.value)}
            placeholder="e.g. Hifz, Aalim course, etc."
          />
        </Field>

        <Field label="Which Islamic scholars do you listen to?" required>
          <Input
            value={scholarsListenedTo}
            onChange={(e) => setScholarsListenedTo(e.target.value)}
            placeholder="e.g. Shaykh Salih al-Fawzan, etc."
          />
        </Field>

        <Field label="How did you get to know about this course?" required>
          <Input
            value={howHeard}
            onChange={(e) => setHowHeard(e.target.value)}
            placeholder="e.g. WhatsApp, YouTube, Friend, etc."
          />
        </Field>

        <Field label="Have you completed Mafateeh al-Talab Level 1?" required>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCompletedLevel1(true)}
              className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                completedLevel1 === true
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <Check
                className={`h-4 w-4 inline mr-1.5 ${
                  completedLevel1 === true ? "opacity-100" : "opacity-0"
                }`}
              />
              Yes
            </button>
            <button
              type="button"
              onClick={() => setCompletedLevel1(false)}
              className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-all ${
                completedLevel1 === false
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <Check
                className={`h-4 w-4 inline mr-1.5 ${
                  completedLevel1 === false ? "opacity-100" : "opacity-0"
                }`}
              />
              No
            </button>
          </div>
        </Field>

        <Field label="Do you promise to participate in the course till the end?" required>
          <button
            type="button"
            onClick={() => setPromiseToParticipate(!promiseToParticipate)}
            className={`w-full rounded-lg border py-2.5 text-sm font-medium transition-all ${
              promiseToParticipate
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-muted-foreground/30"
            }`}
          >
            <Check
              className={`h-4 w-4 inline mr-1.5 ${
                promiseToParticipate ? "opacity-100" : "opacity-0"
              }`}
            />
            Yes, I promise
          </button>
        </Field>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <Spinner className="h-4 w-4 mr-2" /> : null}
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </Card>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
