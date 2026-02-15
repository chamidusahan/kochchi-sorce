import React from "react";
import { motion } from "framer-motion";
import {
  Droplet,
  Flame,
  FlaskConical,
  Leaf,
  ShieldCheck,
  Sprout,
  Thermometer,
  Truck,
  Users,
} from "lucide-react";

const heroHighlights = [
  { icon: <Flame className="text-red-400" size={26} />, label: "Heat index", value: "175k SHU" },
  { icon: <Leaf className="text-emerald-400" size={26} />, label: "Organic plots", value: "12 gardens" },
  { icon: <Truck className="text-orange-400" size={26} />, label: "Island deliveries", value: "+1,200 /mo" },
  { icon: <Users className="text-sky-300" size={26} />, label: "Craft team", value: "18 makers" },
];

const craftPillars = [
  {
    icon: <Flame className="text-red-400" size={28} />,
    title: "Flavor-first ferments",
    description: "Six-week ferments coax sweetness before the fermented heat takes over.",
  },
  {
    icon: <Sprout className="text-emerald-400" size={28} />,
    title: "Regenerative beds",
    description: "Compost-rich soils, cover crops, and coconut mulch keep roots cool and thriving.",
  },
  {
    icon: <ShieldCheck className="text-indigo-300" size={28} />,
    title: "Lab-tested heat",
    description: "Every batch is bench-tested for scoville consistency and balanced acidity.",
  },
  {
    icon: <Droplet className="text-cyan-300" size={28} />,
    title: "Rain harvested",
    description: "Filtered rainwater irrigation protects delicate pods from stress.",
  },
];

const journeyMilestones = [
  {
    year: "2015",
    badge: "Origins",
    title: "Garden experiments",
    description: "First Nai Kochchi lots raised under coconut shade with hand-mixed soils.",
  },
  {
    year: "2018",
    badge: "Micro batches",
    title: "50-bottle fermentation runs",
    description: "Documented heat curves and fermentation notes to lock in signature flavor.",
  },
  {
    year: "2022",
    badge: "Scale",
    title: "Living greenhouse network",
    description: "Expanded into climate-managed tunnels while staying pesticide-free.",
  },
  {
    year: "2025",
    badge: "Today",
    title: "Island-wide flavor lab",
    description: "Partner farmers and a tasting studio release new blends every week.",
  },
];

const qualityProtocols = [
  {
    icon: <FlaskConical className="text-red-300" size={26} />,
    title: "Fermentation labs",
    body: "Molasses-fed ferments monitored daily at 18°C for 42 days to build depth.",
  },
  {
    icon: <Thermometer className="text-amber-300" size={26} />,
    title: "Climate control",
    body: "Shade, humidity, and airflow tracked hourly so pods mature without stress.",
  },
  {
    icon: <ShieldCheck className="text-emerald-300" size={26} />,
    title: "Traceable batches",
    body: "QR-coded lots carry sensor data, lab notes, and tasting impressions for every bottle.",
  },
];

const galleryImages = [
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.16.20.jpeg", label: "Sunrise picking lane" },
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.16.30.jpeg", label: "Weigh-in at 18.5 kg" },
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.16.32.jpeg", label: "Sorting ruby pods" },
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.24.29.jpeg", label: "Tunnel walkway" },
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.24.47.jpeg", label: "Harvest inspection" },
  { src: "/images/WhatsApp%20Image%202026-01-11%20at%2021.24.50.jpeg", label: "Ripeness check" },
];

const AboutUs = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-black via-[#09090f] to-red-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_15%_12%,rgba(248,113,113,0.25),transparent_65%),radial-gradient(780px_520px_at_85%_78%,rgba(37,99,235,0.25),transparent_70%)]" />

      <div className="relative z-10 pb-28 space-y-24">
        <section className="px-4 pt-28 pb-20 sm:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto grid gap-12 items-center lg:grid-cols-[1.15fr,0.85fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-red-200"
              >
                Since 2015
              </motion.span>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight"
              >
                A flavor lab rooted in Sri Lankan soil
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base sm:text-lg text-white/70"
              >
                Dawn harvests, rainfall-fed beds, and obsessive fermentation logs shape every bottle of Spice Up. Walk through the gardens, labs, and people responsible for the island's boldest Nai Kochchi heat.
              </motion.p>

              <div className="grid gap-4 pt-6 sm:grid-cols-2">
                {heroHighlights.map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4 }}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/40">
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/60">{item.label}</p>
                      <p className="text-xl font-semibold text-white">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-transparent"
            >
              <img
                src="/images/WhatsApp%20Image%202026-01-11%20at%2021.16.08.jpeg"
                alt="Fresh Nai Kochchi harvest baskets"
                className="h-[380px] w-full object-cover sm:h-[420px] lg:h-[460px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-red-200">Lot #142</p>
                  <p className="text-2xl font-semibold">Dawn-picked Nai Kochchi</p>
                </div>
                <span className="rounded-full bg-red-600/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide">18.5 kg</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 sm:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto text-center space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-extrabold"
            >
              Pillars of the spice-up garden craft
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto max-w-3xl text-sm sm:text-base text-white/70"
            >
              We chase layered flavor over pure fire. Every decision - from shade nets to ferment journals - is tuned to deliver a balanced, craveable burn.
            </motion.p>
          </div>
          <div className="mx-auto mt-10 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {craftPillars.map((pillar) => (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4 }}
                className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-[0_24px_55px_-28px_rgba(248,113,113,0.45)]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/35">
                  {pillar.icon}
                </span>
                <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                <p className="text-sm text-white/70">{pillar.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="px-4 sm:px-8 lg:px-16">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr,0.85fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold">Our journey in heat</h2>
              <p className="text-sm text-white/70">
                What started as a backyard experiment has become a measured craft. These moments mark the evolution of Spice Up and the growers who make it possible.
              </p>
              <div className="relative pl-6 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b from-red-500 via-red-400/40 to-transparent">
                {journeyMilestones.map((milestone, index) => (
                  <div key={milestone.year} className="relative pb-12 last:pb-0">
                    <span className="absolute left-[-9px] top-2 h-4 w-4 rounded-full bg-red-500 shadow-[0_0_0_4px_rgba(248,113,113,0.2)]" />
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <p className="text-xs uppercase tracking-[0.4em] text-red-300">{milestone.badge}</p>
                      <div className="mt-2 flex items-baseline gap-4">
                        <p className="text-3xl font-bold text-red-200">{milestone.year}</p>
                        <h3 className="text-lg font-semibold text-white">{milestone.title}</h3>
                      </div>
                      <p className="mt-3 text-sm text-white/70">{milestone.description}</p>
                    </div>
                    {index === journeyMilestones.length - 1 ? null : (
                      <span className="absolute left-[-1px] bottom-0 h-10 w-0.5 bg-red-500/40" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl border border-white/10 bg-black/40 p-6"
            >
              <h2 className="text-3xl font-bold">Quality rituals</h2>
              <p className="mt-3 text-sm text-white/70">
                Tasting panels, sensor logs, and lab checks keep every bottle honest. Here's how we protect the signature burn.
              </p>
              <div className="mt-6 space-y-5">
                {qualityProtocols.map((protocol) => (
                  <div key={protocol.title} className="flex items-start gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
                      {protocol.icon}
                    </span>
                    <div className="space-y-1.5">
                      <p className="font-semibold text-white">{protocol.title}</p>
                      <p className="text-sm text-white/65">{protocol.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-center text-xs uppercase tracking-widest text-red-200">
                Certified handcrafted in Sri Lanka - Zero artificial additives
              </div>
            </motion.div>
          </div>
        </section>

        <section className="px-4 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold">Garden journal gallery</h2>
                <p className="text-sm text-white/70">
                  Snapshots from harvest week - the quick pace, the quality checks, and the glow of the tunnel lights.
                </p>
              </div>
              <a
                href="/order"
                className="inline-flex items-center gap-2 rounded-full border border-red-500/60 bg-red-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-red-200 transition hover:bg-red-500/20"
              >
                Order today
              </a>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image) => (
                <motion.figure
                  key={image.src}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4 }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40"
                >
                  <img
                    src={image.src}
                    alt={image.label}
                    className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3 text-xs uppercase tracking-wide text-white/80">
                    {image.label}
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center"
          >
            <h2 className="text-3xl font-bold">Book a tasting or walk the beds</h2>
            <p className="mt-3 text-sm text-white/70">
              Fridays are for field walks, fermentation tastings, and sensory labs. Bring the crew, taste direct from the barrel, and take home limited micro-batches.
            </p>
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
          </motion.div>
        </section>
      </div>
    </section>
  );
};

export default AboutUs;
