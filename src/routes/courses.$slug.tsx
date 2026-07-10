import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock, PlayCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/use-auth";
import { AnimateIn } from "@/components/animate-in";
import { LectureListSkeleton } from "@/components/skeleton";

export const Route = createFileRoute("/courses/$slug")({
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useParams();
  const { user, loading } = useAuth();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description, cover_url, is_published")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  const { data: lectures = [], isLoading: lecturesLoading } = useQuery({
    queryKey: ["lectures", course?.id],
    enabled: !!course?.id,
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

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-4xl px-6 py-12 w-full">
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 mb-6 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> All courses
        </Link>

        {courseLoading ? (
          <div className="space-y-4">
            <div className="skeleton h-4 w-24 rounded-md" />
            <div className="skeleton h-12 w-3/4 rounded-md" />
            <div className="skeleton h-6 w-1/2 rounded-md" />
          </div>
        ) : course ? (
          <AnimateIn animation="fade-in">
            {course.cover_url && (
              <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-8 border border-border/60 shadow-scholarly">
                <img
                  src={course.cover_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
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
              <Badge variant="secondary" className="text-xs">
                {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
              </Badge>
            </div>
            {course.description && (
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">{course.description}</p>
            )}
          </AnimateIn>
        ) : null}

        <div className="mt-12">
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
                      {l.description && <div className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{l.description}</div>}
                    </div>
                    {user ? (
                      <Button asChild size="sm" variant="secondary" className="shrink-0">
                        <Link to="/lectures/$id" params={{ id: l.id }}>
                          <PlayCircle className="h-4 w-4 mr-1.5" /> Watch
                        </Link>
                      </Button>
                    ) : (
                      <Button asChild size="sm" variant="outline" disabled={loading} className="shrink-0">
                        <Link to="/auth"><Lock className="h-3.5 w-3.5 mr-1.5" />Sign in</Link>
                      </Button>
                    )}
                  </Card>
                </AnimateIn>
              ))}
            </div>
          )}
        </div>

        {course && !user && (
          <AnimateIn animation="fade-in" delay={200}>
            <Card className="mt-10 p-8 bg-gradient-to-br from-primary/5 to-gold/5 border-primary/20 text-center">
              <div className="gold-divider mb-4" />
              <p className="font-serif text-lg text-primary">Create a free account to watch the lectures and download the notes.</p>
              <Button asChild className="mt-4 shadow-scholarly"><Link to="/auth">Sign in or register</Link></Button>
            </Card>
          </AnimateIn>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
