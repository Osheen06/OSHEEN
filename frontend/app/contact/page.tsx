import { Mail, MapPin, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Section, SectionHeader } from "@/components/ui/Section";

export const metadata = {
  title: "Contact"
};

export default function ContactPage() {
  return (
    <Section className="pt-12">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <SectionHeader
            align="left"
            eyebrow="Contact"
            title="Bring the mirror to your demo, boutique, or pitch room."
            copy="For competitions, vendor pilots, investor conversations, or a brutally honest product jam, send a note."
          />
          <div className="mt-8 grid gap-3">
            <div className="rounded-[1.5rem] border border-white/80 bg-white/68 p-5 shadow-panel backdrop-blur">
              <Mail className="mb-4 h-5 w-5 text-blush-strong" />
              <p className="font-black text-ink">hello@osheen.local</p>
              <p className="mt-1 text-sm text-ink/54">Demo inbox placeholder</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/80 bg-white/68 p-5 shadow-panel backdrop-blur">
              <MapPin className="mb-4 h-5 w-5 text-blush-strong" />
              <p className="font-black text-ink">Built from India, designed for everywhere</p>
              <p className="mt-1 text-sm text-ink/54">Fashion-tech with local vendor roots</p>
            </div>
            <div className="rounded-[1.5rem] border border-white/80 bg-gradient-to-br from-white via-pearl to-blush/60 p-5 text-ink shadow-aura">
              <Sparkles className="mb-4 h-5 w-5 text-blush-strong" />
              <p className="font-black">Pitch line</p>
              <p className="mt-2 text-sm leading-6 text-ink/62">“Osheen reduces doubt before purchase and turns catalogues into emotional styling rooms.”</p>
            </div>
          </div>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}
