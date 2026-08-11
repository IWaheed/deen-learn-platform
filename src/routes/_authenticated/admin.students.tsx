import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, GraduationCap, Calendar, Mail } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimateIn } from "@/components/animate-in";
import { Skeleton } from "@/components/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const listStudents = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.auth.admin.listUsers({ perPage: 10000 });
  return (data?.users ?? [])
    .filter((u) => u.email)
    .map((u) => ({
      id: u.id,
      email: u.email!,
      fullName: (u.user_metadata?.full_name as string) ?? u.email!.split("@")[0],
      rollNumber: (u.user_metadata?.roll_number as string) ?? null,
      enrolledCourses: (u.user_metadata?.enrolled_courses as string[]) ?? [],
      createdAt: u.created_at,
    }))
    .sort((a, b) => {
      if (!a.rollNumber) return 1;
      if (!b.rollNumber) return -1;
      return a.rollNumber.localeCompare(b.rollNumber);
    });
});

export const Route = createFileRoute("/_authenticated/admin/students")({
  component: AdminStudentsPage,
  head: () => ({ meta: [{ title: "Students — Admin — Deen Learn Platform" }] }),
});

function AdminStudentsPage() {
  const { data: students = [], isLoading } = useQuery({
    queryKey: ["admin", "students"],
    queryFn: listStudents,
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center">
          <Users className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="font-serif text-2xl text-primary">Students</h1>
          <p className="text-sm text-muted-foreground">
            {students.length} registered student{students.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Roll Number</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Enrolled Courses</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <GraduationCap className="h-10 w-10 text-muted-foreground/50 mb-2" />
                      <p className="font-serif italic text-lg">No students registered yet.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      {s.rollNumber ? (
                        <span className="font-mono font-medium">{s.rollNumber}</span>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          None
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{s.fullName}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>
                      {s.enrolledCourses.length > 0 ? (
                        <Badge variant="secondary">{s.enrolledCourses.length}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
