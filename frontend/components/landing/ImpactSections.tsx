import { ArrowRight, Leaf, Store, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

export function ImpactSections() {
  return (
    <Section className="pt-8">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-pistachio/80 via-cream to-blush/70 p-8 shadow-aura">
          <Leaf className="mb-8 h-8 w-8 text-ink" />
          <h2 className="max-w-lg font-display text-4xl font-black leading-tight text-ink">Returns are expensive. Doubt is the real cost.</h2>
          <p className="mt-5 max-w-xl leading-8 text-ink/66">
            Osheen helps shoppers decide with more clarity before the parcel ever leaves the store, reducing waste,
            reverse logistics, and the quiet guilt of buying blindly.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/62 p-5">
              <Truck className="mb-4 h-5 w-5" />
              <p className="font-bold">Fewer return loops</p>
            </div>
            <div className="rounded-2xl bg-white/62 p-5">
              <Leaf className="mb-4 h-5 w-5" />
              <p className="font-bold">Smarter first buys</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-white/70 p-8 text-ink shadow-glass backdrop-blur">
          <Store className="mb-8 h-8 w-8 text-blush-strong" />
          <h2 className="max-w-lg font-display text-4xl font-black leading-tight">Local boutiques deserve a digital mirror too.</h2>
          <p className="mt-5 max-w-xl leading-8 text-ink/64">
            Vendors can upload products, tag moods, and create catalogues that feel premium without needing a large
            tech team. The first MVP keeps it simple and demo-ready.
          </p>
          <ButtonLink href="/vendor" className="mt-8">
            Open vendor dashboard
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
