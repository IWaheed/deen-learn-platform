import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { BookOpen, LogOut, MessageSquare, ShieldCheck, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient } from "@tanstack/react-query";

export function SiteHeader() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="border-b border-border/60 bg-parchment/70 backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-scholarly">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <div className="font-serif text-lg font-semibold text-primary">Deen Learn Platform</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Islamic Studies</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Courses</Link>
          {user && (
            <Link to="/questions" className="hover:text-primary transition-colors">My Questions</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {loading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="hidden sm:inline max-w-[140px] truncate">{user.email}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="font-normal">
                  <div className="text-xs text-muted-foreground">Signed in as</div>
                  <div className="truncate">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/questions"><MessageSquare className="h-4 w-4 mr-2" />My Questions</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><ShieldCheck className="h-4 w-4 mr-2" />Admin panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" variant="default">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
