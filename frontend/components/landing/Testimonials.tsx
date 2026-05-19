import { Quote } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/Section";

const testimonials = [
  {
    quote: "I do not need twenty tabs and three friends on video call. I need one honest preview.",
    name: "Aanya, campus shopper"
  },
  {
    quote: "The mood tags make our catalogue feel less like inventory and more like styling.",
    name: "Riya, boutique owner"
  },
  {
    quote: "This is the kind of demo that makes fashion-tech feel human, not gimmicky.",
    name: "Innovation cell mentor"
  }
];

export function Testimonials() {
  return (
    <Section>
      <SectionHeader eyebrow="Proof of feeling" title="People remember confidence." />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.name} className="lift-card rounded-[1.75rem] border border-white/80 bg-white/68 p-7 shadow-panel backdrop-blur">
            <Quote className="mb-8 h-7 w-7 text-blush-strong" />
            <blockquote className="text-xl font-black leading-8 text-ink">“{testimonial.quote}”</blockquote>
            <figcaption className="mt-8 text-sm font-semibold text-ink/54">{testimonial.name}</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
