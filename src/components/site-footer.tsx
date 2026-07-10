function getHijriDate(): string {
  const date = new Date();
  const hijri = new Intl.DateTimeFormat("ar-SA-u-ca-islamic", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  return hijri;
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24 relative">
      <div className="gold-divider absolute -top-px left-1/2 -translate-x-1/2" />
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="font-serif italic text-center md:text-left">
            &ldquo;Seeking knowledge is an obligation upon every Muslim.&rdquo;
            <div className="text-xs text-muted-foreground/60 mt-1">— Ibn Mājah, 224</div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <span className="font-urdu text-xs" dir="rtl">{getHijriDate()}</span>
            <span>© {new Date().getFullYear()} Deen Learn Platform</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
