import { Section, SectionHeader } from "@/components/ui/Section";
import { VendorDashboard } from "@/components/vendor/VendorDashboard";

export const metadata = {
  title: "Vendor Dashboard"
};

export default function VendorPage() {
  return (
    <Section className="pt-12">
      <SectionHeader
        eyebrow="Vendor dashboard"
        title="Turn local inventory into a digital styling room."
        copy="Boutiques and MSMEs can launch a polished catalogue, upload products, and let shoppers discover pieces by mood and moment."
      />
      <div className="mt-12">
        <VendorDashboard />
      </div>
    </Section>
  );
}
