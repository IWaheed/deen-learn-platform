import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, Menu, MessageSquare, ShieldCheck, User as UserIcon, X } from "lucide-react";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    router.invalidate();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="border-b border-border/60 bg-parchment/80 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground grid place-items-center shadow-scholarly transition-transform group-hover:scale-105">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5A2.5 2.5 0 0 1 4 19.5Z" />
              <path d="M9 2v20" />
              <path d="M9 7h7" />
              <path d="M9 11h7" />
              <path d="M9 15h4" />
            </svg>
          </div>
          <div className="leading-snug">
            <div className="font-serif font-semibold text-primary">Deen Learn Platform</div>
            <div className="text-xs text-muted-foreground">Islamic Studies</div>
          </div>
        </Link>

        {/* Desktop nav */}
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
          {/* Mobile menu toggle */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {loading ? null : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 hidden md:inline-flex">
                  <UserIcon className="h-4 w-4" />
                  <span className="max-w-[140px] truncate">{user.email}</span>
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
            <Button asChild size="sm" variant="default" className="hidden md:inline-flex">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/60 bg-parchment animate-page-enter">
          <nav className="mx-auto max-w-6xl px-6 py-4 flex flex-col gap-2 text-sm">
            <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent transition-colors">Courses</Link>
            {user ? (
              <>
                <Link to="/questions" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent transition-colors">My Questions</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 hover:bg-accent transition-colors">Admin panel</Link>
                )}
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="rounded-md px-3 py-2 text-left text-destructive hover:bg-destructive/10 transition-colors">Sign out</button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 bg-primary text-primary-foreground text-center">Sign in</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
