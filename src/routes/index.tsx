import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, GraduationCap, MessageCircle, PlayCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/use-auth";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: courses = [] } = useQuery({
    queryKey: ["courses", "published"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, slug, title, description, cover_url, created_at")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img src={heroImg} alt="" className="w-full h-full object-cover opacity-40" width={1600} height={900} />
            <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
          </div>
          <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
            <div className="max-w-2xl">
              <div className="text-xs uppercase tracking-[0.25em] text-gold font-medium ornament">
                Traditional knowledge, digitally delivered
              </div>
              <h1 className="mt-6 font-serif text-5xl md:text-6xl leading-[1.05] text-primary">
                Sit at the feet of<br />the scholars.
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-xl">
                Recorded lectures, downloadable notes, and direct correspondence with
                your teacher — a complete madrasah, wherever you are.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/">Browse courses</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/auth">Sign in to study</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: PlayCircle, title: "Recorded lectures", body: "Every session is preserved — revisit and review at your own pace." },
            { icon: BookOpen, title: "Course notes", body: "Downloadable PDFs and companion documents for every lecture." },
            { icon: MessageCircle, title: "Ask the teacher", body: "Send private questions and receive a reply directly from the shaykh." },
          ].map(({ icon: Icon, title, body }) => (
            <Card key={title} className="p-6 bg-card/60 border-border/60 shadow-scholarly">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-serif text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </Card>
          ))}
        </section>

        {/* Courses */}
        <section id="courses" className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-gold ornament">The Curriculum</div>
              <h2 className="mt-3 font-serif text-4xl text-primary">Courses</h2>
            </div>
          </div>

          {courses.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground font-serif italic text-lg">
                Courses will appear here soon, in shā&rsquo; Allāh.
              </p>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <Link key={c.id} to="/courses/$slug" params={{ slug: c.slug }} className="group">
                  <Card className="overflow-hidden h-full bg-card border-border/60 shadow-scholarly transition-all hover:shadow-lg hover:-translate-y-0.5">
                    <div className="aspect-[16/9] bg-gradient-to-br from-primary/15 to-gold/20 relative overflow-hidden">
                      {c.cover_url ? (
                        <img src={c.cover_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="absolute inset-0 grid place-items-center">
                          <BookOpen className="h-10 w-10 text-primary/40" />
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-xl text-primary group-hover:text-primary/80 transition-colors">{c.title}</h3>
                      {c.description && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{c.description}</p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
