import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { BookMarked, Inbox } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/lib/use-auth";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/", replace: true });
  }, [loading, isAdmin, navigate]);

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 grid place-items-center text-muted-foreground font-serif italic">
          {loading ? "Loading…" : "You do not have access to this page."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="border-b border-border/60 bg-parchment/40">
        <div className="mx-auto max-w-6xl px-6 flex gap-6 text-sm">
          <Link to="/admin" activeOptions={{ exact: true }}
            activeProps={{ className: "border-primary text-primary" }}
            className="py-3 border-b-2 border-transparent hover:text-primary flex items-center gap-1.5">
            <BookMarked className="h-4 w-4" /> Courses
          </Link>
          <Link to="/admin/questions"
            activeProps={{ className: "border-primary text-primary" }}
            className="py-3 border-b-2 border-transparent hover:text-primary flex items-center gap-1.5">
            <Inbox className="h-4 w-4" /> Questions
          </Link>
        </div>
      </div>
      <main className="flex-1"><Outlet /></main>
    </div>
  );
}
