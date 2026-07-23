import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Hero } from "@/components/marketing/hero";
import { ProblemSolution } from "@/components/marketing/problem-solution";
import { ServiceArea } from "@/components/marketing/service-area";
import { Pricing } from "@/components/marketing/pricing";
import { ContactSection } from "@/components/marketing/contact-section";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ contact_sent?: string; contact_error?: string }>;
}) {
  const { contact_sent, contact_error } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <ProblemSolution />
        <ServiceArea />
        <Pricing />
        <ContactSection sent={contact_sent === "1"} error={contact_error === "1"} />
      </main>
      <SiteFooter />
    </div>
  );
}
