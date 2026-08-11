import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Deen Learn Platform" },
      { name: "description", content: "Privacy policy for Deen Learn Platform." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl px-6 py-16 w-full">
        <h1 className="font-serif text-4xl text-primary">Privacy Policy</h1>
        <p className="mt-1 text-sm text-muted-foreground">Last updated: July 2026</p>
        <div className="gold-divider mt-4 mb-8" />
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <p>
            Deen Learn Platform respects your privacy. This policy explains what data we collect and
            how it is used.
          </p>
          <h2 className="font-serif text-xl text-primary">1. Data We Collect</h2>
          <p>
            When you create an account, we collect your name and email address. We also store
            questions you submit and any documents you upload.
          </p>
          <h2 className="font-serif text-xl text-primary">2. How We Use Data</h2>
          <p>
            Your data is used solely to provide the platform services: authentication, course
            access, Q&A, and document delivery. We do not sell or share personal data with third
            parties.
          </p>
          <h2 className="font-serif text-xl text-primary">3. Data Storage</h2>
          <p>
            Data is stored securely via Supabase. We retain your data for as long as your account is
            active. You may request deletion at any time.
          </p>
          <h2 className="font-serif text-xl text-primary">4. Cookies</h2>
          <p>
            We use essential cookies for authentication. No tracking or analytics cookies are used.
          </p>
          <h2 className="font-serif text-xl text-primary">5. Contact</h2>
          <p>For privacy inquiries, please contact us through the platform.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
