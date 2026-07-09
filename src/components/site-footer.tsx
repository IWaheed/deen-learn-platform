export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="font-serif italic">
          &ldquo;Seeking knowledge is an obligation upon every Muslim.&rdquo;
        </div>
        <div>© {new Date().getFullYear()} Nūr al-ʿIlm. All rights reserved.</div>
      </div>
    </footer>
  );
}
