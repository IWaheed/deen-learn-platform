import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminCourses,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

function AdminCourses() {
  const qc = useQueryClient();
  const { data: courses = [] } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", slug: "", description: "", cover_url: "", is_published: true });

  function openNew() {
    setEditing(null);
    setForm({ title: "", slug: "", description: "", cover_url: "", is_published: true });
    setOpen(true);
  }
  function openEdit(c: any) {
    setEditing(c);
    setForm({ title: c.title, slug: c.slug, description: c.description ?? "", cover_url: c.cover_url ?? "", is_published: c.is_published });
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        slug: (form.slug || slugify(form.title)).trim(),
        description: form.description.trim() || null,
        cover_url: form.cover_url.trim() || null,
        is_published: form.is_published,
      };
      if (editing) {
        const { error } = await supabase.from("courses").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("courses").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Saved"); setOpen(false); qc.invalidateQueries({ queryKey: ["admin-courses"] }); qc.invalidateQueries({ queryKey: ["courses", "published"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-courses"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary">Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, edit, and organise your curriculum.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1.5" /> New course</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {courses.map((c) => (
          <Card key={c.id} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-xl text-primary truncate">{c.title}</h3>
                  {!c.is_published && <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">Draft</span>}
                </div>
                <div className="text-xs text-muted-foreground mt-1">/{c.slug}</div>
                {c.description && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{c.description}</p>}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button asChild size="sm" variant="secondary"><Link to="/admin/courses/$id" params={{ id: c.id }}>Manage lectures</Link></Button>
              <Button size="sm" variant="ghost" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => confirm(`Delete "${c.title}"?`) && del.mutate(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit course" : "New course"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} /></div>
            <div><Label>URL slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. fiqh-of-worship" /></div>
            <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>Cover image URL (optional)</Label><Input value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} placeholder="https://…" /></div>
            <div className="flex items-center gap-3"><Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} /><Label>Published</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => save.mutate()} disabled={save.isPending || !form.title.trim()}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
