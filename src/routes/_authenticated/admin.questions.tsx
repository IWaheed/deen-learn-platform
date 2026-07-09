import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Inbox } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/questions")({
  component: AdminQuestions,
});

function AdminQuestions() {
  const qc = useQueryClient();
  const { data: questions = [] } = useQuery({
    queryKey: ["admin-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("id, subject, body, answer, answered_at, created_at, user_id, lecture_id, lectures(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const reply = useMutation({
    mutationFn: async ({ id, answer }: { id: string; answer: string }) => {
      const { error } = await supabase.from("questions").update({ answer, answered_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Reply sent"); qc.invalidateQueries({ queryKey: ["admin-questions"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-serif text-3xl text-primary">Question Inbox</h1>
      <p className="text-sm text-muted-foreground mt-1">Reply directly to your students.</p>

      <div className="mt-8 space-y-4">
        {questions.length === 0 && (
          <Card className="p-10 text-center border-dashed">
            <Inbox className="h-10 w-10 mx-auto text-muted-foreground" />
            <p className="mt-3 font-serif italic text-muted-foreground">No questions yet.</p>
          </Card>
        )}
        {questions.map((q: any) => (
          <Card key={q.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-lg text-primary">{q.subject}</h3>
              {q.answer ? <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Answered</Badge> : <Badge variant="outline">New</Badge>}
            </div>
            {q.lectures?.title && <div className="text-xs text-muted-foreground mt-1">On: {q.lectures.title}</div>}
            <p className="mt-2 text-sm whitespace-pre-wrap">{q.body}</p>
            <div className="mt-4">
              <Textarea
                rows={3}
                placeholder="Write your reply…"
                defaultValue={q.answer ?? ""}
                onChange={(e) => setDrafts({ ...drafts, [q.id]: e.target.value })}
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    const answer = (drafts[q.id] ?? q.answer ?? "").trim();
                    if (!answer) return toast.error("Reply cannot be empty");
                    reply.mutate({ id: q.id, answer });
                  }}
                  disabled={reply.isPending}
                >
                  {q.answer ? "Update reply" : "Send reply"}
                </Button>
              </div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString()}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
