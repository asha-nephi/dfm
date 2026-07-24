import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Hero } from "@/components/marketing/hero";
import { WhoItsFor } from "@/components/marketing/who-its-for";
import { ProblemSolution } from "@/components/marketing/problem-solution";
import { ServiceArea } from "@/components/marketing/service-area";
import { Pricing } from "@/components/marketing/pricing";
import { CohostSection } from "@/components/marketing/cohost-section";
import { ContactSection } from "@/components/marketing/contact-section";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    contact_sent?: string;
    contact_error?: string;
    cohost_error?: string;
  }>;
}) {
  const { contact_sent, contact_error, cohost_error } = await searchParams;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://deseretfacilities.com";
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Deseret Facility Management",
    legalName: "Deseret Facility Management Ltd",
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    image: `${siteUrl}/opengraph-image`,
    description:
      "Verified, transparent property management for absentee and diaspora landlords in Lagos, Nigeria — dated photos of every job, itemized costs, one flat monthly fee.",
    email: "nephi.asha@deseretfacilities.com",
    ...(whatsapp ? { telephone: whatsapp.startsWith("+") ? whatsapp : `+${whatsapp}` } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ikeja",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    areaServed: ["Ikeja GRA", "Opebi", "Allen Avenue", "Maryland", "Ogba"],
    priceRange: "₦₦",
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <WhoItsFor />
        <ProblemSolution />
        <ServiceArea />
        <Pricing />
        <CohostSection error={cohost_error === "1"} />
        <ContactSection sent={contact_sent === "1"} error={contact_error === "1"} />
      </main>
      <SiteFooter />
    </div>
  );
}
