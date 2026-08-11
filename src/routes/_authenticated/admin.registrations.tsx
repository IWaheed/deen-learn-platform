import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileDown, ScrollText } from "lucide-react";
import { createServerFn } from "@tanstack/react-start";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnimateIn } from "@/components/animate-in";
import { Skeleton } from "@/components/skeleton";

interface Registration {
  id: string;
  rollNumber: string;
  fullNameEn: string;
  fullNameUr: string;
  gender: string;
  email: string;
  age: string;
  phoneNumber: string;
  education: string;
  islamicEducation: string;
  scholarsListenedTo: string;
  howHeard: string;
  completedLevel1: string;
  promiseToParticipate: string;
  createdAt: string;
}

const COURSE_SLUG = "uloom-ul-quran";

function extractRegistrations(
  users: {
    id: string;
    email?: string;
    created_at: string;
    user_metadata?: Record<string, unknown>;
  }[],
): Registration[] {
  return users
    .filter((u) => {
      const enrolled = u.user_metadata?.enrolled_courses as string[] | undefined;
      return enrolled?.includes(COURSE_SLUG) && u.user_metadata?.roll_number;
    })
    .map((u) => {
      const m = u.user_metadata ?? {};
      return {
        id: u.id,
        rollNumber: (m.roll_number as string) ?? "",
        fullNameEn: (m.full_name as string) ?? "",
        fullNameUr: (m.reg_name_ur as string) ?? "",
        gender: (m.reg_gender as string) ?? "",
        email: u.email ?? "",
        age: (m.reg_age as string) ?? "",
        phoneNumber: (m.reg_phone as string) ?? "",
        education: (m.reg_education as string) ?? "",
        islamicEducation: (m.reg_islamic_education as string) ?? "",
        scholarsListenedTo: (m.reg_scholars as string) ?? "",
        howHeard: (m.reg_how_heard as string) ?? "",
        completedLevel1:
          m.reg_completed_level_1 === true ? "Yes" : m.reg_completed_level_1 === false ? "No" : "",
        promiseToParticipate: m.reg_promise === true ? "Yes" : m.reg_promise === false ? "No" : "",
        createdAt: u.created_at,
      };
    })
    .sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));
}

const listRegistrations = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data } = await supabaseAdmin.auth.admin.listUsers({ perPage: 10000 });
  return extractRegistrations(data?.users ?? []);
});

export const downloadCsv = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data } = await supabaseAdmin.auth.admin.listUsers({ perPage: 10000 });
  const rows = extractRegistrations(data?.users ?? []);

  const headers = [
    "Roll Number",
    "Full Name (EN)",
    "Full Name (UR)",
    "Gender",
    "Email",
    "Age",
    "Phone",
    "Education",
    "Islamic Education",
    "Scholars Listened To",
    "How Heard",
    "Completed Level 1",
    "Promise to Participate",
  ];

  const csvRows = rows.map((r) =>
    [
      r.rollNumber,
      r.fullNameEn,
      r.fullNameUr,
      r.gender,
      r.email,
      r.age,
      r.phoneNumber,
      r.education,
      r.islamicEducation,
      r.scholarsListenedTo,
      r.howHeard,
      r.completedLevel1,
      r.promiseToParticipate,
    ]
      .map((v) => `"${v.replace(/"/g, '""')}"`)
      .join(","),
  );

  return [headers.join(","), ...csvRows].join("\n");
});

export const Route = createFileRoute("/_authenticated/admin/registrations")({
  component: AdminRegistrationsPage,
  head: () => ({
    meta: [{ title: "Registrations — Admin — Deen Learn Platform" }],
  }),
});

function AdminRegistrationsPage() {
  const [genderFilter, setGenderFilter] = useState("all");

  const { data: registrations = [], isLoading } = useQuery({
    queryKey: ["admin", "registrations"],
    queryFn: listRegistrations,
  });

  const filteredRegistrations = registrations.filter(
    (r) => genderFilter === "all" || r.gender === genderFilter,
  );

  async function handleDownload() {
    const csv = await downloadCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "course-registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 grid place-items-center">
            <ScrollText className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-primary">Registrations</h1>
            <p className="text-sm text-muted-foreground">
              {filteredRegistrations.length} registration
              {filteredRegistrations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <Button onClick={handleDownload} disabled={registrations.length === 0}>
            <FileDown className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredRegistrations.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <ScrollText className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-4 text-muted-foreground font-serif italic text-lg">
            No registrations yet.
          </p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="p-3 font-medium text-muted-foreground">Roll No</th>
                <th className="p-3 font-medium text-muted-foreground">Name</th>
                <th className="p-3 font-medium text-muted-foreground">Gender</th>
                <th className="p-3 font-medium text-muted-foreground">Email</th>
                <th className="p-3 font-medium text-muted-foreground">Phone</th>
                <th className="p-3 font-medium text-muted-foreground">Age</th>
                <th className="p-3 font-medium text-muted-foreground">Education</th>
                <th className="p-3 font-medium text-muted-foreground">Islamic Ed.</th>
                <th className="p-3 font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredRegistrations.map((r, i) => (
                <AnimateIn key={r.id} animation="fade-in" delay={i * 20}>
                  <tr className="border-t border-border/40 hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-mono text-primary font-bold">{r.rollNumber || "—"}</td>
                    <td className="p-3">
                      <div className="font-medium">{r.fullNameEn}</div>
                      <div className="text-xs text-muted-foreground" dir="rtl">
                        {r.fullNameUr}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{r.gender || "—"}</td>
                    <td className="p-3 text-muted-foreground">{r.email}</td>
                    <td className="p-3 text-muted-foreground">{r.phoneNumber}</td>
                    <td className="p-3 text-muted-foreground">{r.age}</td>
                    <td className="p-3 text-muted-foreground">{r.education}</td>
                    <td className="p-3 text-muted-foreground">{r.islamicEducation}</td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                </AnimateIn>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
