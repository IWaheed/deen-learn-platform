import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, FileText, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/admin/courses/$id")({
  component: ManageCourse,
});

function ManageCourse() {
  const { id } = Route.useParams();
  const qc = useQueryClient();

  const { data: course } = useQuery({
    queryKey: ["admin-course", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("courses").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: lectures = [] } = useQuery({
    queryKey: ["admin-lectures", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("lectures").select("*").eq("course_id", id).order("position");
      if (error) throw error;
      return data;
    },
  });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: "", description: "", youtube_url: "", position: 0 });

  function openNew() {
    setEditing(null);
    setForm({ title: "", description: "", youtube_url: "", position: lectures.length });
    setOpen(true);
  }
  function openEdit(l: any) {
    setEditing(l);
    setForm({ title: l.title, description: l.description ?? "", youtube_url: l.youtube_url ?? "", position: l.position });
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        course_id: id,
        title: form.title.trim(),
        description: form.description.trim() || null,
        youtube_url: form.youtube_url.trim() || null,
        position: form.position,
      };
      if (editing) {
        const { error } = await supabase.from("lectures").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lectures").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Saved"); setOpen(false); qc.invalidateQueries({ queryKey: ["admin-lectures", id] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (lectureId: string) => {
      const { error } = await supabase.from("lectures").delete().eq("id", lectureId);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-lectures", id] }); },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link to="/admin" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> All courses
      </Link>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl text-primary">{course?.title ?? "Course"}</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage lectures and attached documents.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-1.5" /> New lecture</Button>
      </div>

      <div className="space-y-3">
        {lectures.map((l) => (
          <LectureRow key={l.id} lecture={l} onEdit={() => openEdit(l)} onDelete={() => confirm("Delete this lecture?") && del.mutate(l.id)} />
        ))}
        {lectures.length === 0 && (
          <Card className="p-8 text-center border-dashed text-muted-foreground italic font-serif">No lectures yet.</Card>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit lecture" : "New lecture"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
            <div><Label>YouTube URL</Label><Input value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} placeholder="https://youtube.com/watch?v=…" /></div>
            <div><Label>Position (order)</Label><Input type="number" value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} /></div>
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

function LectureRow({ lecture, onEdit, onDelete }: { lecture: any; onEdit: () => void; onDelete: () => void }) {
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: docs = [] } = useQuery({
    queryKey: ["admin-docs", lecture.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("lecture_documents").select("*").eq("lecture_id", lecture.id).order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const path = `${lecture.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("lecture-docs").upload(path, file);
      if (upErr) throw upErr;
      const { error } = await supabase.from("lecture_documents").insert({
        lecture_id: lecture.id, name: file.name, storage_path: path, size_bytes: file.size,
      });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Uploaded"); qc.invalidateQueries({ queryKey: ["admin-docs", lecture.id] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const delDoc = useMutation({
    mutationFn: async (doc: any) => {
      await supabase.storage.from("lecture-docs").remove([doc.storage_path]);
      const { error } = await supabase.from("lecture_documents").delete().eq("id", doc.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-docs", lecture.id] }),
  });

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">#{lecture.position}</span>
            <h3 className="font-serif text-lg text-primary truncate">{lecture.title}</h3>
          </div>
          {lecture.youtube_url && <div className="text-xs text-muted-foreground truncate mt-0.5">{lecture.youtube_url}</div>}
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={onEdit}><Pencil className="h-4 w-4" /></Button>
          <Button size="sm" variant="ghost" onClick={onDelete}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
      </div>

      <div className="mt-4 pl-4 border-l-2 border-border/60 space-y-1.5">
        {docs.map((d) => (
          <div key={d.id} className="flex items-center gap-2 text-sm">
            <FileText className="h-4 w-4 text-primary shrink-0" />
            <span className="flex-1 truncate">{d.name}</span>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => delDoc.mutate(d)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        ))}
        <div>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) upload.mutate(f); e.target.value = ""; }}
          />
          <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()} disabled={upload.isPending}>
            <Upload className="h-3.5 w-3.5 mr-1.5" /> {upload.isPending ? "Uploading…" : "Attach document"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
