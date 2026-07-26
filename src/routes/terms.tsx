import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Deen Learn Platform" },
      { name: "description", content: "Terms of service for using Deen Learn Platform." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 mx-auto max-w-3xl px-6 py-16 w-full">
        <h1 className="font-serif text-4xl text-primary">Terms of Service</h1>
        <p className="mt-1 text-sm text-muted-foreground">Last updated: July 2026</p>
        <div className="gold-divider mt-4 mb-8" />
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <p>
            By accessing Deen Learn Platform, you agree to these terms. If you do not agree, do not use the platform.
          </p>
          <h2 className="font-serif text-xl text-primary">1. Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
          <h2 className="font-serif text-xl text-primary">2. Content</h2>
          <p>Course materials are provided for personal study only. Redistribution, reproduction, or commercial use of lecture recordings, notes, or documents is prohibited without explicit permission.</p>
          <h2 className="font-serif text-xl text-primary">3. Conduct</h2>
          <p>Users must not misuse the platform, including submitting abusive questions or attempting to circumvent access controls.</p>
          <h2 className="font-serif text-xl text-primary">4. Limitation of Liability</h2>
          <p>Deen Learn Platform is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform.</p>
          <p className="text-sm pt-4">If you have questions, contact us via the platform.</p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
