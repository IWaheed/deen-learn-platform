import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock, PlayCircle, GraduationCap, CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { enrollInCourse } from "@/lib/enrollment";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/use-auth";
import { AnimateIn } from "@/components/animate-in";
import { LectureListSkeleton } from "@/components/skeleton";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Spinner } from "@/components/spinner";

const GATED_SLUGS = ["quranic-sciences-zamzami", "uloom-ul-quran"];

export const Route = createFileRoute("/courses/$slug")({
  component: CoursePage,
  head: ({ loaderData }: any) => ({
    meta: [
      {
        title: loaderData?.title
          ? `${loaderData.title} — Deen Learn Platform`
          : "Course — Deen Learn Platform",
      },
      {
        name: "description",
        content:
          loaderData?.description ?? "Study classical Islamic sciences with recorded lectures.",
      },
    ],
  }),
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("courses")
      .select("title, description")
      .eq("slug", params.slug)
      .maybeSingle();
    return data ?? undefined;
  },
});

function CoursePage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rollInput, setRollInput] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const isGated = GATED_SLUGS.includes(slug);

  const enrolledCourses: string[] = user?.user_metadata?.enrolled_courses ?? [];
  const isEnrolled = enrolledCourses.includes(slug);

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description, cover_url")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  const { data: lectures = [], isLoading: lecturesLoading } = useQuery({
    queryKey: ["lectures", course?.id],
    enabled: !!course?.id && !(isGated && !isEnrolled),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lectures")
        .select("id, title, description, position")
        .eq("course_id", course!.id)
        .order("position", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  async function handleEnroll() {
    if (!course || !user || !rollInput.trim()) return;
    setEnrolling(true);
    try {
      await enrollInCourse({
        data: { courseSlug: slug, rollNumber: rollInput.trim(), userId: user.id },
      });
      await supabase.auth.getUser();
      toast.success("Successfully enrolled in the course!");
      queryClient.invalidateQueries({ queryKey: ["course", slug] });
      window.location.reload();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  }

  const showEnrollPrompt = isGated && !!user && !isEnrolled;

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-4xl px-6 py-12 w-full">
        <Breadcrumbs crumbs={[{ label: "Home", to: "/" }, { label: course?.title ?? "Course" }]} />

        {courseLoading ? (
          <div className="space-y-4">
            <div className="skeleton h-4 w-24 rounded-md" />
            <div className="skeleton h-12 w-3/4 rounded-md" />
            <div className="skeleton h-6 w-1/2 rounded-md" />
          </div>
        ) : course ? (
          <AnimateIn animation="fade-in">
            {course.cover_url && (
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8 border border-border/60 shadow-scholarly">
                <img src={course.cover_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
              </div>
            )}
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold font-medium mb-2">
              <span>Course</span>
              <span className="w-8 h-px bg-gold/50" />
            </div>
            <h1 className="mt-1 font-serif text-4xl md:text-5xl text-primary leading-tight">
              {course.title}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              {isGated && !isEnrolled && (
                <Badge
                  variant="secondary"
                  className="text-xs border-amber-400 text-amber-700 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400"
                >
                  <Lock className="h-3 w-3 mr-1" /> Enrollment required
                </Badge>
              )}
              {!isGated && (
                <Badge variant="secondary" className="text-xs">
                  {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
                </Badge>
              )}
              {isEnrolled && (
                <Badge className="text-xs bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                  <CheckCircle className="h-3 w-3 mr-1" /> Enrolled
                </Badge>
              )}
            </div>
            {course.description && (
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {course.description}
              </p>
            )}
          </AnimateIn>
        ) : null}

        {showEnrollPrompt && (
          <AnimateIn animation="fade-in" delay={100}>
            <Card className="mt-10 p-8 border-primary/20 bg-gradient-to-br from-primary/5 to-gold/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-primary">Enroll in this course</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter the roll number issued during registration
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="roll-number" className="sr-only">
                    Roll number
                  </Label>
                  <Input
                    id="roll-number"
                    placeholder="e.g. 3030001"
                    value={rollInput}
                    onChange={(e) => setRollInput(e.target.value)}
                    maxLength={7}
                    className="font-mono"
                  />
                </div>
                <Button onClick={handleEnroll} disabled={enrolling || !rollInput.trim()}>
                  {enrolling ? (
                    <Spinner className="h-4 w-4 mr-1.5" />
                  ) : (
                    <GraduationCap className="h-4 w-4 mr-1.5" />
                  )}
                  {enrolling ? "Enrolling..." : "Enroll"}
                </Button>
              </div>
            </Card>
          </AnimateIn>
        )}

        {isGated && !user && (
          <AnimateIn animation="fade-in" delay={100}>
            <Card className="mt-10 p-8 border-primary/20 bg-gradient-to-br from-primary/5 to-gold/5 text-center">
              <Lock className="h-8 w-8 mx-auto text-primary/60 mb-3" />
              <h3 className="font-serif text-lg text-primary">Enrollment required</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                This course requires a student roll number. Sign in or register first, then enroll
                using your roll number.
              </p>
              <Button asChild className="mt-4 shadow-scholarly">
                <Link to="/auth">Sign in or register</Link>
              </Button>
            </Card>
          </AnimateIn>
        )}

        <div className="mt-12">
          {isGated && !isEnrolled ? null : (
            <>
              <AnimateIn animation="fade-in" delay={100}>
                <h2 className="font-serif text-2xl text-primary mb-4">Lectures</h2>
              </AnimateIn>

              {lecturesLoading ? (
                <LectureListSkeleton count={5} />
              ) : lectures.length === 0 ? (
                <Card className="p-8 text-center border-dashed text-muted-foreground italic font-serif">
                  No lectures yet.
                </Card>
              ) : (
                <div className="space-y-3">
                  {lectures.map((l, i) => (
                    <AnimateIn key={l.id} animation="fade-in" delay={i * 80}>
                      <Card className="p-5 flex items-center gap-4 bg-card/70 hover:bg-card transition-all hover:shadow-md group">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center font-serif text-sm font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {i + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-serif text-lg leading-snug">{l.title}</div>
                          {l.description && (
                            <div className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                              {l.description}
                            </div>
                          )}
                        </div>
                        <Button asChild size="sm" variant="secondary" className="shrink-0">
                          <Link to="/lectures/$id" params={{ id: l.id }}>
                            <PlayCircle className="h-4 w-4 mr-1.5" /> Watch
                          </Link>
                        </Button>
                      </Card>
                    </AnimateIn>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {course && !user && !isGated && (
          <AnimateIn animation="fade-in" delay={200}>
            <Card className="mt-10 p-8 bg-gradient-to-br from-primary/5 to-gold/5 border-primary/20 text-center">
              <div className="gold-divider mb-4" />
              <p className="font-serif text-lg text-primary">
                Create a free account to watch the lectures and download the notes.
              </p>
              <Button asChild className="mt-4 shadow-scholarly">
                <Link to="/auth">Sign in or register</Link>
              </Button>
            </Card>
          </AnimateIn>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
