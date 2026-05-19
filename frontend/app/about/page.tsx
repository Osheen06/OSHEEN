import { ArrowRight, Eye, HeartHandshake, Rocket, ShieldCheck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";

export const metadata = {
  title: "About"
};

const beliefs = [
  {
    icon: Eye,
    title: "Clarity is emotional",
    copy: "The best shopping tech does not shout. It quietly removes the panic between the hanger and the payment button."
  },
  {
    icon: ShieldCheck,
    title: "Trial rooms should feel safe",
    copy: "Osheen gives people another path: private, comfortable, and still expressive."
  },
  {
    icon: HeartHandshake,
    title: "Local fashion deserves better software",
    copy: "Boutiques should be able to offer premium digital discovery without becoming tech companies overnight."
  },
  {
    icon: Rocket,
    title: "The future is a styling layer",
    copy: "Virtual try-on is only step one. The bigger idea is a mirror that understands context, mood, and identity."
  }
];

export default function AboutPage() {
  return (
    <>
      <Section className="pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeader
            align="left"
            eyebrow="About Osheen"
            title="A mirror for the version of you walking into the moment."
            copy="Osheen began with a simple frustration: fashion shopping asks people to imagine too much. Will this look good on me? Will it feel right for the event? Will I regret buying it? Our answer is a warm, visual, AI-assisted trial room."
          />
          <div className="rounded-[2rem] border border-white/80 bg-gradient-to-br from-white via-pearl to-pistachio/50 p-8 text-ink shadow-aura">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-ink/42">Mission</p>
            <h2 className="mt-4 font-display text-4xl font-black leading-tight">Make fashion decisions feel clear, comfortable, and personal.</h2>
            <p className="mt-6 leading-8 text-ink/64">
              We are building for online shoppers, offline boutiques, students, founders, wedding guests, working women,
              and anyone who has ever wished the mirror could answer with kindness and precision.
            </p>
            <ButtonLink href="/try-on" className="mt-8">
              Try the MVP
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </Section>

      <Section className="pt-4">
        <SectionHeader eyebrow="Vision" title="From preview to personal fashion operating system." />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {beliefs.map((belief) => (
            <article key={belief.title} className="lift-card rounded-[1.75rem] border border-white/80 bg-white/68 p-7 shadow-panel backdrop-blur">
              <belief.icon className="mb-8 h-7 w-7 text-blush-strong" />
              <h3 className="text-2xl font-black text-ink">{belief.title}</h3>
              <p className="mt-4 leading-7 text-ink/62">{belief.copy}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="pt-4">
        <div className="rounded-[2rem] bg-gradient-to-br from-blush via-pearl to-pistachio p-8 shadow-glass">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-ink/48">Future direction</p>
          <div className="mt-5 grid gap-6 lg:grid-cols-3">
            {["Body-aware fit intelligence", "Boutique catalogue SaaS", "Mood-led shopping assistant"].map((item) => (
              <div key={item} className="rounded-[1.5rem] bg-white/62 p-6">
                <p className="text-2xl font-black text-ink">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
