import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock, PlayCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/courses/$slug")({
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useParams();
  const { user, loading } = useAuth();

  const { data: course } = useQuery({
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

  const { data: lectures = [] } = useQuery({
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
        <Link to="/" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 mb-6">
          <ArrowLeft className="h-3.5 w-3.5" /> All courses
        </Link>

        {course && (
          <>
            <div className="text-xs uppercase tracking-[0.25em] text-gold ornament">Course</div>
            <h1 className="mt-3 font-serif text-4xl md:text-5xl text-primary">{course.title}</h1>
            {course.description && (
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed max-w-2xl">{course.description}</p>
            )}

            <div className="mt-12">
              <h2 className="font-serif text-2xl text-primary mb-4">Lectures</h2>
              {lectures.length === 0 ? (
                <Card className="p-8 text-center border-dashed text-muted-foreground italic font-serif">
                  No lectures yet.
                </Card>
              ) : (
                <div className="space-y-3">
                  {lectures.map((l, i) => (
                    <Card key={l.id} className="p-5 flex items-center gap-4 bg-card/70 hover:bg-card transition-colors">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center font-serif">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-lg">{l.title}</div>
                        {l.description && <div className="text-sm text-muted-foreground line-clamp-1">{l.description}</div>}
                      </div>
                      {user ? (
                        <Button asChild size="sm" variant="secondary">
                          <Link to="/lectures/$id" params={{ id: l.id }}>
                            <PlayCircle className="h-4 w-4 mr-1.5" /> Watch
                          </Link>
                        </Button>
                      ) : (
                        <Button asChild size="sm" variant="outline" disabled={loading}>
                          <Link to="/auth"><Lock className="h-3.5 w-3.5 mr-1.5" />Sign in</Link>
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {!user && (
              <Card className="mt-10 p-6 bg-primary/5 border-primary/20 text-center">
                <p className="font-serif text-lg">Create a free account to watch the lectures and download the notes.</p>
                <Button asChild className="mt-4"><Link to="/auth">Sign in or register</Link></Button>
              </Card>
            )}
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
