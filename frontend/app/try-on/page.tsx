import { TryOnStudio } from "@/components/try-on/TryOnStudio";
import { Section, SectionHeader } from "@/components/ui/Section";

export const metadata = {
  title: "Virtual Try-On"
};

export default function TryOnPage() {
  return (
    <Section className="pt-12">
      <SectionHeader
        eyebrow="Virtual try-on studio"
        title="Stop imagining. Start seeing."
        copy="Upload a photo, choose a piece, switch the event, and let Osheen create a lightweight AI-assisted outfit preview with mood styling."
      />
      <div className="mt-12">
        <TryOnStudio />
      </div>
    </Section>
  );
}
