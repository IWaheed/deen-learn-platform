import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/questions")({
  component: QuestionsPage,
});

function QuestionsPage() {
  const { data: questions = [] } = useQuery({
    queryKey: ["my-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("id, subject, body, answer, answered_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl px-6 py-10 w-full">
        <div className="text-xs uppercase tracking-[0.25em] text-gold ornament">Correspondence</div>
        <h1 className="mt-3 font-serif text-4xl text-primary">My Questions</h1>
        <p className="mt-2 text-muted-foreground">Your private conversations with the teacher.</p>

        <div className="mt-8 space-y-4">
          {questions.length === 0 ? (
            <Card className="p-10 text-center border-dashed">
              <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-3 font-serif italic text-muted-foreground">You haven&rsquo;t asked anything yet. Open a lecture to send your first question.</p>
            </Card>
          ) : (
            questions.map((q) => (
              <Card key={q.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-lg text-primary">{q.subject}</h3>
                  {q.answer
                    ? <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Answered</Badge>
                    : <Badge variant="outline">Awaiting reply</Badge>}
                </div>
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{q.body}</p>
                {q.answer && (
                  <div className="mt-4 pl-4 border-l-2 border-gold/60 bg-parchment/50 p-3 rounded-r">
                    <div className="text-xs uppercase tracking-wider text-gold mb-1">Teacher&rsquo;s reply</div>
                    <p className="text-sm whitespace-pre-wrap">{q.answer}</p>
                  </div>
                )}
                <div className="mt-3 text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString()}</div>
              </Card>
            ))
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
