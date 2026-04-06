import { motion } from "framer-motion";
import { CreditCard, Shield, TrendingUp, Building, ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    icon: Building,
    title: "Créditos",
    description:
      "Hipotecarios, personales, automotriz y educativos. Compara tasas y encuentra el mejor para ti.",
    items: ["Hipotecarios", "Personales", "Automotriz", "Educativos"],
    available: true,
    href: "/creditos-hipotecarios",
    accent: "#0466C8",
    image: "/images/index/creditos.webp",
    stat: "50+",
    statLabel: "productos",
  },
  {
    icon: Shield,
    title: "Seguros",
    description: "Protege lo que más importa. Coberturas y precios de las principales aseguradoras.",
    items: ["Vida", "Auto", "Hogar", "Gastos Médicos"],
    available: false,
    accent: "#0353A4",
  },
  {
    icon: CreditCard,
    title: "Tarjetas",
    description: "La tarjeta perfecta según tus hábitos. Sin anualidad, cashback, millas y más.",
    items: ["Sin anualidad", "Cashback", "Millas"],
    available: false,
    accent: "#7c3aed",
  },
  {
    icon: TrendingUp,
    title: "Inversiones",
    description: "Haz crecer tu dinero. CDT, fondos de inversión y más opciones.",
    items: ["CDT", "Fondos", "Bonos"],
    available: false,
    accent: "#059669",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function CategoriesPreview() {
  const navigate = useNavigate();
  const featured = categories[0];
  const rest = categories.slice(1);

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-3">
            Todo en un lugar
          </h2>
          <p className="text-muted-foreground text-lg max-w-md">
            Empieza a comparar créditos hoy. Seguros, tarjetas e inversiones pronto.
          </p>
        </motion.div>

        {/* ── Grid layout ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-4"
        >
          {/* ── Featured: Créditos (2 cols) ── */}
          <motion.div
            variants={cardVariants}
            onClick={() => navigate(featured.href!)}
            className="lg:col-span-2 group relative rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/6 cursor-pointer"
          >
            {/* Image */}
            <div className="relative h-52 overflow-hidden bg-muted">
              {featured.image && (
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/25 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-full bg-[#0466C8] text-white text-xs font-bold shadow-lg">
                  Disponible ahora
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-2xl font-black text-foreground">{featured.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-xs leading-relaxed">
                    {featured.description}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="text-3xl font-black text-primary">{featured.stat}</div>
                  <div className="text-xs text-muted-foreground">{featured.statLabel}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-5 mt-4">
                {featured.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2.5 py-1 rounded-full bg-primary/8 text-primary font-semibold border border-primary/15"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold group/btn shadow-md shadow-primary/20 transition-all duration-200">
                Explorar créditos
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          {/* ── Coming soon cards ── */}
          {rest.map((cat) => (
            <motion.div
              key={cat.title}
              variants={cardVariants}
              className="relative rounded-2xl border border-border/50 bg-muted/20 overflow-hidden p-6"
            >
              {/* Coming soon badge */}
              <div className="absolute top-4 right-4">
                <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-[#FFD60A] text-[#001233]">
                  <Lock className="w-2.5 h-2.5" />
                  Pronto
                </span>
              </div>

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${cat.accent}12` }}
              >
                <cat.icon className="w-6 h-6" style={{ color: `${cat.accent}70` }} />
              </div>

              <h3 className="text-xl font-black text-foreground/60 mb-2">{cat.title}</h3>
              <p className="text-muted-foreground/60 text-sm mb-5 leading-relaxed line-clamp-3">
                {cat.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {cat.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs px-2 py-0.5 rounded-full bg-muted/60 text-muted-foreground/50"
                  >
                    {item}
                  </span>
                ))}
              </div>

              {/* Subtle corner accent */}
              <div
                className="absolute bottom-0 right-0 w-28 h-28 rounded-tl-full opacity-[0.04] pointer-events-none"
                style={{ backgroundColor: cat.accent }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
