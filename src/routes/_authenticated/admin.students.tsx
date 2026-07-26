import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, GraduationCap, Calendar, Mail } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimateIn } from "@/components/animate-in";
import { Skeleton } from "@/components/skeleton";

const listStudents = createServerFn({ method: 'GET' })
  .handler(async () => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const { data } = await supabaseAdmin.auth.admin.listUsers()
    return (data?.users ?? [])
      .filter(u => u.email)
      .map(u => ({
        id: u.id,
        email: u.email!,
        fullName: (u.user_metadata?.full_name as string) ?? u.email!.split('@')[0],
        rollNumber: (u.user_metadata?.roll_number as string) ?? null,
        enrolledCourses: (u.user_metadata?.enrolled_courses as string[]) ?? [],
        createdAt: u.created_at,
      }))
      .sort((a, b) => {
        if (!a.rollNumber) return 1
        if (!b.rollNumber) return -1
        return a.rollNumber.localeCompare(b.rollNumber)
      })
  })

export const Route = createFileRoute("/_authenticated/admin/students")({
  component: AdminStudentsPage,
  head: () => ({ meta: [{ title: "Students — Admin — Deen Learn Platform" }] }),
})

function AdminStudentsPage() {
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["admin", "students"],
    queryFn: listStudents,
  })

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-serif text-2xl text-primary">Students</h1>
          <p className="text-sm text-muted-foreground">{students.length} registered student{students.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-xl border border-border/60 bg-card p-5">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </div>
          ))}
        </div>
      ) : students.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <GraduationCap className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground font-serif italic text-lg">No students registered yet.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {students.map((s, i) => (
            <AnimateIn key={s.id} animation="fade-in" delay={i * 30}>
              <Card className="p-4 flex items-center gap-4 hover:bg-card/80 transition-colors">
                <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center font-serif font-bold text-sm">
                  {s.rollNumber ? s.rollNumber.slice(-4) : '??'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{s.fullName}</div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{s.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(s.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {s.rollNumber ? (
                    <div className="font-mono text-lg font-bold text-primary">{s.rollNumber}</div>
                  ) : (
                    <Badge variant="outline" className="text-xs">No roll number</Badge>
                  )}
                  {s.enrolledCourses.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {s.enrolledCourses.length} enrollment{s.enrolledCourses.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </Card>
            </AnimateIn>
          ))}
        </div>
      )}
    </div>
  )
}
