import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, FileText, Download, Send, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/lib/use-auth";
import { AnimateIn } from "@/components/animate-in";
import { LecturePageSkeleton } from "@/components/skeleton";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Spinner } from "@/components/spinner";

export const Route = createFileRoute("/_authenticated/lectures/$id")({
  component: LecturePage,
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("lectures")
      .select("title, courses(title)")
      .eq("id", params.id)
      .maybeSingle();
    return data;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.title ? `${loaderData.title} — Deen Learn Platform` : "Lecture — Deen Learn Platform" },
      { name: "description", content: `Lecture: ${loaderData?.title ?? ""} — part of ${(loaderData as any)?.courses?.title ?? "Deen Learn Platform"}` },
    ],
  }),
});

function extractYouTubeId(url?: string | null): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function LecturePage() {
  const { id } = Route.useParams();
  const qc = useQueryClient();
  const { user } = useAuth();

  const { data: lecture, isLoading } = useQuery({
    queryKey: ["lecture", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lectures")
        .select("id, title, description, youtube_url, course_id, position, courses(slug, title)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw notFound();
      return data;
    },
  });

  const { data: allLectures = [] } = useQuery({
    queryKey: ["lectures", lecture?.course_id],
    enabled: !!lecture?.course_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lectures")
        .select("id, title, position")
        .eq("course_id", lecture!.course_id)
        .order("position", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: docs = [] } = useQuery({
    queryKey: ["lecture-docs", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lecture_documents")
        .select("id, name, storage_path, size_bytes")
        .eq("lecture_id", id)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const currentIndex = allLectures.findIndex((l) => l.id === id);
  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;

  const videoId = extractYouTubeId(lecture?.youtube_url);

  async function download(path: string, name: string) {
    const { data, error } = await supabase.storage.from("lecture-docs").createSignedUrl(path, 60);
    if (error) return toast.error(error.message);
    const a = document.createElement("a");
    a.href = data.signedUrl;
    a.download = name;
    a.click();
  }

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const ask = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in required");
      const { error } = await supabase.from("questions").insert({
        user_id: user.id,
        lecture_id: id,
        subject: subject.trim(),
        body: body.trim(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Your question has been sent to the teacher.");
      setSubject(""); setBody("");
      qc.invalidateQueries({ queryKey: ["my-questions"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-4xl px-6 py-10 w-full">
        {isLoading ? (
          <LecturePageSkeleton />
        ) : lecture ? (
          <>
            <Breadcrumbs
              crumbs={[
                { label: "Home", to: "/" },
                { label: (lecture.courses as any)?.title ?? "Course", to: "/courses/$slug", params: { slug: (lecture.courses as any)?.slug } },
                { label: lecture.title },
              ]}
            />

            <AnimateIn animation="fade-in">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold font-medium mb-2">
                <span>Lecture {lecture.position}</span>
                <span className="w-8 h-px bg-gold/50" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-primary leading-tight">{lecture.title}</h1>
              {lecture.description && <p className="mt-3 text-muted-foreground leading-relaxed">{lecture.description}</p>}
            </AnimateIn>

            {/* Video */}
            <AnimateIn animation="fade-in" delay={100}>
              <div className="mt-8 aspect-video rounded-xl overflow-hidden border border-border/60 shadow-scholarly bg-black">
                {videoId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                    title={lecture.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-muted-foreground">
                    No video attached yet.
                  </div>
                )}
              </div>
            </AnimateIn>

            {/* Prev / Next navigation */}
            <AnimateIn animation="fade-in" delay={150}>
              <div className="mt-6 flex items-center justify-between gap-4">
                {prevLecture ? (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/lectures/$id" params={{ id: prevLecture.id }}>
                      <ChevronLeft className="h-4 w-4 mr-1" /> {prevLecture.title}
                    </Link>
                  </Button>
                ) : <div />}
                {nextLecture ? (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/lectures/$id" params={{ id: nextLecture.id }}>
                      {nextLecture.title} <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                ) : <div />}
              </div>
            </AnimateIn>

            {/* Course notes */}
            <AnimateIn animation="fade-in" delay={200}>
              <section className="mt-10">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold font-medium mb-4">
                  <span>Course notes</span>
                  <span className="w-8 h-px bg-gold/50" />
                </div>
                {docs.length === 0 ? (
                  <Card className="p-6 border-dashed text-center text-muted-foreground italic font-serif">
                    No documents attached to this lecture.
                  </Card>
                ) : (
                  <div className="space-y-2">
                    {docs.map((d) => (
                      <Card key={d.id} className="p-3 flex items-center gap-3 transition-all hover:shadow-sm">
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate text-sm font-medium">{d.name}</div>
                          {d.size_bytes && <div className="text-xs text-muted-foreground">{(d.size_bytes / 1024).toFixed(0)} KB</div>}
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => download(d.storage_path, d.name)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </AnimateIn>

            {/* Quiz */}
            <AnimateIn animation="fade-in" delay={225}>
              <QuizSection lectureId={id} userId={user?.id} />
            </AnimateIn>

            {/* Ask the teacher */}
            <AnimateIn animation="fade-in" delay={250}>
              <section className="mt-14">
                <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold font-medium mb-1">
                  <span>Ask the teacher</span>
                  <span className="w-8 h-px bg-gold/50" />
                </div>
                <h2 className="mt-1 font-serif text-2xl text-primary">Have a question on this lecture?</h2>
                <p className="text-sm text-muted-foreground mt-1">Your question is private, sent directly to the shaykh.</p>
                <Card className="mt-4 p-5 space-y-3 bg-card/70">
                  <div><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Regarding the second condition of ṭahārah" maxLength={200} /></div>
                  <div><Label>Your question</Label><Textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} /></div>
                  <div className="flex justify-end">
                    <Button onClick={() => ask.mutate()} disabled={ask.isPending || !subject.trim() || !body.trim()} className="shadow-scholarly">
                      {ask.isPending ? <Spinner className="h-4 w-4 mr-1.5" /> : <Send className="h-4 w-4 mr-1.5" />}
                      Send question
                    </Button>
                  </div>
                </Card>
              </section>
            </AnimateIn>
          </>
        ) : null}
      </main>
      <SiteFooter />
    </div>
  );
}

function QuizSection({ lectureId, userId }: { lectureId: string; userId?: string }) {
  const qc = useQueryClient();

  const { data: questions = [] } = useQuery({
    queryKey: ["quiz-questions", lectureId],
    queryFn: async () => {
      const { data, error } = await supabase.from("quiz_questions").select("*").eq("lecture_id", lectureId).order("position");
      if (error) throw error;
      return data;
    },
  });

  const { data: attempts = [] } = useQuery({
    queryKey: ["quiz-attempts", lectureId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("quiz_attempts").select("*").eq("lecture_id", lectureId).eq("user_id", userId!).order("completed_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<any>(null);

  function reset() {
    setAnswers({});
    setSubmitted(null);
  }

  const submitQuiz = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Sign in required");
      if (Object.keys(answers).length !== questions.length) throw new Error("Answer all questions first");

      let score = 0;
      const questionResults = questions.map((q: any) => {
        const selected = answers[q.id];
        const correct = selected === q.correct_option_id;
        if (correct) score++;
        return { questionId: q.id, selectedOptionId: selected, isCorrect: correct };
      });

      const { data: attempt, error: attemptErr } = await supabase
        .from("quiz_attempts")
        .insert({ user_id: userId, lecture_id: lectureId, score, total: questions.length })
        .select("id")
        .single();
      if (attemptErr) throw attemptErr;

      const { error: answersErr } = await supabase.from("quiz_answers").insert(
        questionResults.map((r: any) => ({
          attempt_id: attempt.id,
          question_id: r.questionId,
          selected_option_id: r.selectedOptionId,
          is_correct: r.isCorrect,
        }))
      );
      if (answersErr) throw answersErr;

      return { score, total: questions.length, results: questionResults };
    },
    onSuccess: (data) => {
      toast.success(`You scored ${data.score}/${data.total}`);
      setSubmitted(data);
      qc.invalidateQueries({ queryKey: ["quiz-attempts", lectureId] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (questions.length === 0) return null;

  const bestAttempt = attempts.length > 0 ? attempts.reduce((best: any, a: any) => a.score > best.score ? a : best, attempts[0]) : null;

  return (
    <section className="mt-14">
      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-gold font-medium mb-1">
        <span>Quiz</span>
        <span className="w-8 h-px bg-gold/50" />
      </div>
      <h2 className="mt-1 font-serif text-2xl text-primary">Test your knowledge</h2>
      <p className="text-sm text-muted-foreground mt-1">Answer the following multiple-choice questions.</p>

      {bestAttempt && !submitted && (
        <p className="text-sm text-muted-foreground mt-2">
          Best score: <span className="text-primary font-medium">{bestAttempt.score}/{bestAttempt.total}</span> ({attempts.length} attempt{attempts.length !== 1 ? "s" : ""})
        </p>
      )}

      <Card className="mt-4 p-5 space-y-6 bg-card/70">
        {questions.map((q: any, qi: number) => {
          const options: { id: string; text: string }[] = q.options as any;
          const isCorrect = submitted ? submitted.results.find((r: any) => r.questionId === q.id)?.isCorrect : null;

          return (
            <div key={q.id}>
              <div className="flex items-start gap-2">
                <span className="text-sm font-bold text-primary mt-0.5">{qi + 1}.</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{q.question_text}</p>
                  <RadioGroup
                    value={answers[q.id] ?? ""}
                    onValueChange={(v) => setAnswers({ ...answers, [q.id]: v })}
                    disabled={!!submitted}
                    className="mt-2 space-y-1.5"
                  >
                    {options.map((o) => {
                      const selected = answers[q.id] === o.id;
                      const showCorrect = submitted && o.id === q.correct_option_id;
                      const showWrong = submitted && selected && o.id !== q.correct_option_id;
                      return (
                        <div key={o.id} className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${showCorrect ? "bg-green-50 text-green-800" : showWrong ? "bg-red-50 text-red-800" : ""}`}>
                          <RadioGroupItem value={o.id} id={`q${qi}-${o.id}`} disabled={!!submitted} />
                          <Label htmlFor={`q${qi}-${o.id}`} className="flex-1 cursor-pointer text-sm">{o.text}</Label>
                          {showCorrect && <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />}
                          {showWrong && <XCircle className="h-4 w-4 text-red-600 shrink-0" />}
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex justify-between items-center pt-2 border-t border-border/40">
          {submitted ? (
            <>
              <div className="text-sm">
                Score: <span className="font-bold text-primary">{submitted.score}/{submitted.total}</span>
                {submitted.score === submitted.total && " — Perfect!"}
              </div>
              <Button variant="outline" size="sm" onClick={reset}>
                <RotateCcw className="h-4 w-4 mr-1.5" /> Retry
              </Button>
            </>
          ) : !userId ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-muted-foreground">Sign in to record your quiz score</span>
              <Button asChild size="sm" variant="outline">
                <Link to="/auth">Sign in</Link>
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => submitQuiz.mutate()}
              disabled={submitQuiz.isPending || Object.keys(answers).length !== questions.length}
              className="shadow-scholarly"
            >
              {submitQuiz.isPending ? <Spinner className="h-4 w-4 mr-1.5" /> : <CheckCircle2 className="h-4 w-4 mr-1.5" />}
              Submit answers
            </Button>
          )}
        </div>
      </Card>
    </section>
  );
}

export default LecturePage;
