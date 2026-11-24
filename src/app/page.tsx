import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import {
  Abroad,
  Comparison,
  Coverage,
  Hero,
  HowItWorks,
  ServicesGrid,
} from "@/components/marketing/home-sections";
import { PricingSummary } from "@/components/marketing/pricing-summary";
import { ContactSection } from "@/components/marketing/contact-section";
import { SERVICES } from "@/lib/services";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ contact_sent?: string; contact_error?: string; service?: string }>;
}) {
  const { contact_sent, contact_error, service } = await searchParams;

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
      "Cleaning, AC servicing, electrical, plumbing and generator servicing for Lagos properties, with dated before-and-after photos and itemized costs.",
    email: "nephi.asha@deseretfacilities.com",
    ...(whatsapp ? { telephone: whatsapp.startsWith("+") ? whatsapp : `+${whatsapp}` } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ikeja",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    areaServed: "Lagos, Nigeria",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Property services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.short },
      })),
    },
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
        <ServicesGrid />
        <HowItWorks />
        <Abroad />
        <Comparison />
        <PricingSummary />
        <Coverage />
        <ContactSection
          sent={contact_sent === "1"}
          error={contact_error === "1"}
          defaultService={service}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
