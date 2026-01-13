import React from "react";
import { motion } from "framer-motion";
import { Flame, Leaf, Sprout, Truck } from "lucide-react";

const timeline = [
  {
    year: "2015",
    title: "Seeds of Spice",
    description: "Our founders began experimenting with Nai Kochchi plants in a small family garden, studying soils and irrigation methods to keep flavour first.",
  },
  {
    year: "2018",
    title: "Micro-Batch Breakthrough",
    description: "We launched our first micro-batch hot sauce line, hand-filling just 50 bottles a week while perfecting fermentation curves.",
  },
  {
    year: "2022",
    title: "Garden Expansion",
    description: "Two new poly tunnels and a drip-fed nursery allowed us to scale yields without compromising natural farming practices.",
  },
  {
    year: "2025",
    title: "Spice Up Today",
    description: "Island-wide deliveries, community farmer partnerships, and a lab-tested quality process keep every bottle consistently fiery.",
  },
];

const harvestStats = [
  { icon: <Flame className="text-red-400" size={28} />, label: "Average Scoville", value: "175,000 SHU" },
  { icon: <Leaf className="text-green-400" size={28} />, label: "Daily Harvest", value: "65 kg" },
  { icon: <Sprout className="text-emerald-400" size={28} />, label: "Organic Plots", value: "12" },
  { icon: <Truck className="text-orange-400" size={28} />, label: "Island Deliveries", value: "+1,200" },
];

const galleryImages = [
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.16.20.jpeg", label: "Fresh pick at sunrise" },
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.16.30.jpeg", label: "Weighing 18.5 kg batch" },
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.16.32.jpeg", label: "Sorting Nai Kochchi pods" },
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.24.29.jpeg", label: "Greenhouse aisle" },
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.24.47.jpeg", label: "Harvest inspection" },
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.24.50.jpeg", label: "Ripeness check" },
];

const AboutUs = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-[#0f0f12] to-red-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_10%,rgba(248,113,113,0.25),transparent_65%),radial-gradient(700px_480px_at_85%_85%,rgba(75,85,99,0.35),transparent_60%)]" />

      <div className="relative z-10 pb-20">
        <section className="pt-28 pb-16 px-4 sm:px-8 lg:px-16">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-red-200"
            >
              From seed to sauce
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold"
            >
              Immersed in the craft of Sri Lankan heat
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-white/75"
            >
              Every bottle of Spice Up tells a story of early-morning harvests, meticulous sorting, and a relentless respect for the Nai Kochchi chili. Explore the gardens, people, and processes that keep our blends bold.
            </motion.p>
          </div>
        </section>

        <section className="px-4 sm:px-8 lg:px-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {harvestStats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_48px_-24px_rgba(248,113,113,0.45)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40">
                    {stat.icon}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/60">{stat.label}</p>
                    <p className="text-xl font-semibold text-white">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-20 px-4 sm:px-8 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-[1.2fr,1fr] items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40"
            >
              <img
                src="/images/WhatsApp%20Image%202026-01-11%20at%2021.16.08.jpeg"
                alt="Harvest baskets with Nai Kochchi chilies"
                className="w-full h-[360px] object-cover sm:h-[420px] lg:h-[460px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-red-200">Morning harvest</p>
                  <p className="text-2xl font-semibold">18.5 kg fresh Nai Kochchi</p>
                </div>
                <span className="rounded-full bg-red-600/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide">Lot #142</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-5"
            >
              <h2 className="text-3xl font-bold">What sets our gardens apart</h2>
              <p className="text-white/70">
                Shade nets temper the harsh mid-day sun, while coconut-husk mulch keeps roots cool and hydrated. We monitor brix levels weekly to ensure every pod balances sweetness with raw intensity.
              </p>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-red-400" />
                  <span>Fermentation barrels labelled by harvest lot for full traceability.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-red-400" />
                  <span>Rainwater irrigation filtered through natural charcoal beds.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-red-400" />
                  <span>Quick-cool sorting station preserves the vibrant emerald colour before processing.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        <section className="mt-20 px-4 sm:px-8 lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1fr,1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">From field journal</h2>
              <p className="text-white/70">
                Each milestone in our timeline captures an experiment, a learning, and a new way to show the world what Lankan heat can feel like. We continue to develop regenerative practices with partner farms across the island.
              </p>
              <div className="relative pl-6 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b from-red-500 via-red-400/50 to-transparent">
                {timeline.map((entry, index) => (
                  <div key={entry.year} className="relative pb-8">
                    <span className="absolute left-[-9px] top-1.5 h-4 w-4 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(248,113,113,0.2)]" />
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.4em] text-red-300">{entry.year}</p>
                      <h3 className="mt-2 text-lg font-semibold">{entry.title}</h3>
                      <p className="mt-2 text-sm text-white/70">{entry.description}</p>
                    </div>
                    {index === timeline.length - 1 ? null : <span className="absolute left-[-1px] bottom-0 h-8 w-0.5 bg-red-500/50" />}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="rounded-3xl border border-white/10 bg-black/40 p-6"
            >
              <h2 className="text-3xl font-bold">Quality checkpoints</h2>
              <div className="mt-6 space-y-5 text-sm text-white/70">
                <div>
                  <p className="font-semibold text-white">Weight & moisture</p>
                  <p>Every basket is weighed within 10 minutes of harvest and moisture-tested at 12% to maintain consistent heat levels.</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Fermentation control</p>
                  <p>Temperature-controlled tanks hold fermenting mash at 18°C with hourly pH monitoring for a 6-week mellowing cycle.</p>
                </div>
                <div>
                  <p className="font-semibold text-white">Bottling</p>
                  <p>Small-batch bottling ensures ingredients are never heat-treated above 82°C, preserving raw flavours and natural colour.</p>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-xs uppercase tracking-widest text-red-200">
                Certified handcrafted in Sri Lanka · Zero artificial additives
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mt-20 px-4 sm:px-8 lg:px-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold">Garden journal gallery</h2>
              <p className="text-white/70">Snapshots from recent harvest weeks — from early weighing sessions to field inspections.</p>
            </div>
            <a
              href="/order"
              className="inline-flex items-center gap-2 rounded-full border border-red-500/60 bg-red-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-red-200 transition hover:bg-red-500/20"
            >
              Order today
            </a>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image) => (
              <motion.figure
                key={image.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40"
              >
                <img src={image.src} alt={image.label} className="h-64 w-full object-cover transition duration-500 group-hover:scale-105" />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3 text-xs uppercase tracking-wide text-white/80">
                  {image.label}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </section>

        <section className="mt-20 px-4 sm:px-8 lg:px-16">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-3xl font-bold">Visit the gardens or book a tasting</h2>
            <p className="mt-3 text-white/70">We host small groups every Friday for field walks and fermentation tastings. Bring the crew and feel the heat firsthand.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <a
                href="mailto:hello@spiceup.lk"
                className="rounded-full bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-red-900/40 transition hover:brightness-110"
              >
                Email the team
              </a>
              <a
                href="tel:+94701234567"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white/80 hover:text-white"
              >
                Call +94 70 123 4567
              </a>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AboutUs;
