import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, GraduationCap, MessageCircle, PlayCircle, ListOrdered } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/use-auth";
import { AnimateIn } from "@/components/animate-in";
import { CourseCardSkeleton } from "@/components/skeleton";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useAuth();
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, slug, title, description, cover_url, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const coursesWithCounts = await Promise.all(
        (data ?? []).map(async (c) => {
          const { count } = await supabase
            .from("lectures")
            .select("*", { count: "exact", head: true })
            .eq("course_id", c.id);
          return { ...c, lecture_count: count ?? 0 };
        }),
      );
      return coursesWithCounts;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img src={heroImg} alt="" className="w-full h-full object-cover object-center opacity-35" width={1600} height={900} />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
            <div className="geometric-pattern absolute inset-0 -z-10" />
          </div>
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
            <AnimateIn animation="fade-in">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold font-medium">
                  <span className="font-urdu text-sm" dir="rtl">بسم اللہ الرحمن الرحیم</span>
                  <span className="w-8 h-px bg-gold/50" />
                  <span>Traditional knowledge, digitally delivered</span>
                </div>
                <h1 className="mt-6 font-serif text-5xl md:text-7xl leading-[1.05] text-primary">
                  Sit at the feet of<br />the scholars.
                </h1>
                <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
                  Recorded lectures, downloadable notes, and direct correspondence with
                  your teacher — a complete madrasah, wherever you are.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button asChild size="lg" className="shadow-scholarly">
                    <a href="#courses">Browse courses</a>
                  </Button>
                  {user ? (
                    <Button asChild size="lg" variant="outline">
                      <Link to="/questions">My questions</Link>
                    </Button>
                  ) : (
                    <Button asChild size="lg" variant="outline">
                      <Link to="/auth">Sign in to study</Link>
                    </Button>
                  )}
                </div>
              </div>
            </AnimateIn>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Gold divider */}
        <div className="gold-divider" />

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: PlayCircle, title: "Recorded lectures", body: "Every session is preserved — revisit and review at your own pace." },
            { icon: BookOpen, title: "Course notes", body: "Downloadable PDFs and companion documents for every lecture." },
            { icon: MessageCircle, title: "Ask the teacher", body: "Send private questions and receive a reply directly from the shaykh." },
          ].map(({ icon: Icon, title, body }, i) => (
            <AnimateIn key={title} animation="fade-in" delay={i * 150}>
              <Card className="p-6 bg-card/60 border-border/60 shadow-scholarly h-full transition-all hover:shadow-lg hover:-translate-y-0.5">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary grid place-items-center">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-xl text-primary">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </Card>
            </AnimateIn>
          ))}
        </section>

        {/* Courses */}
        <section id="courses" className="mx-auto max-w-6xl px-6 py-16">
          <AnimateIn animation="fade-in">
            <div className="text-center mb-12">
              <div className="text-xs uppercase tracking-[0.25em] text-gold ornament">The Curriculum</div>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl text-primary">Our Courses</h2>
              <div className="gold-divider mt-4" />
            </div>
          </AnimateIn>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <AnimateIn animation="scale-in">
              <Card className="p-12 text-center border-dashed">
                <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground font-serif italic text-lg">
                  Courses will appear here soon, in shā&rsquo; Allāh.
                </p>
              </Card>
            </AnimateIn>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c, i) => (
                <AnimateIn key={c.id} animation="fade-in" delay={i * 100}>
                  <Link to="/courses/$slug" params={{ slug: c.slug }} className="group block">
                    <Card className="overflow-hidden h-full bg-card border-border/60 shadow-scholarly transition-all hover:shadow-xl hover:-translate-y-1">
                      <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 to-gold/15 relative overflow-hidden">
                        {c.cover_url ? (
                          <>
                            <img src={c.cover_url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          </>
                        ) : (
                          <div className="absolute inset-0 grid place-items-center">
                            <BookOpen className="h-10 w-10 text-primary/30" />
                          </div>
                        )}
                        {c.lecture_count > 0 && (
                          <Badge variant="secondary" className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-xs gap-1.5">
                            <ListOrdered className="h-3 w-3" />
                            {c.lecture_count} {c.lecture_count === 1 ? "lecture" : "lectures"}
                          </Badge>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-serif text-xl text-primary group-hover:text-primary/80 transition-colors">{c.title}</h3>
                        {c.description && (
                          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{c.description}</p>
                        )}
                      </div>
                    </Card>
                  </Link>
                </AnimateIn>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
