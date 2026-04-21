import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Home, Car, GraduationCap, Banknote, ArrowRight, Shield, Lock } from "lucide-react";
import { Header, Footer } from "@/features/shared/layout";
import { useTheme } from "@/components/theme-provider";

const creditTypes = [
  {
    icon: Home,
    title: "Créditos Hipotecarios",
    subtitle: "Compra o construye tu hogar",
    description:
      "Compara tasas, plazos y condiciones de créditos hipotecarios VIS y No VIS en pesos o UVR. Más de 20 entidades financieras.",
    href: "/creditos-hipotecarios",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=240&fit=crop&q=80&auto=format",
    stats: [
      { label: "Entidades", value: "20+" },
      { label: "Plazo máx.", value: "30 años" },
      { label: "Financiación", value: "hasta 80%" },
    ],
    available: true,
    tags: ["VIS", "No VIS", "UVR", "Pesos"],
  },
  {
    icon: Car,
    title: "Créditos de Vehículo",
    subtitle: "Financia tu auto o moto",
    description:
      "Encuentra el mejor crédito para comprar tu automóvil o motocicleta. Tasas competitivas y plazos de hasta 8 años.",
    href: "/creditos-vehiculo",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&h=240&fit=crop&q=80&auto=format",
    stats: [
      { label: "Entidades", value: "15+" },
      { label: "Plazo máx.", value: "8 años" },
      { label: "Financiación", value: "hasta 90%" },
    ],
    available: true,
    tags: ["Automóvil", "Motocicleta", "Nuevo", "Usado"],
  },
  {
    icon: GraduationCap,
    title: "Créditos Educativos",
    subtitle: "Invierte en tu futuro",
    description:
      "Financia tu pregrado, posgrado o especialización. Tasas preferenciales y periodos de gracia durante los estudios.",
    href: "/creditos-educativos",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=240&fit=crop&q=80&auto=format",
    stats: [
      { label: "Entidades", value: "10+" },
      { label: "Plazo máx.", value: "15 años" },
      { label: "Desde", value: "$1M" },
    ],
    available: true,
    tags: ["Pregrado", "Posgrado", "Especializaciones"],
  },
  {
    icon: Banknote,
    title: "Libre Inversión",
    subtitle: "Para lo que necesites",
    description:
      "Créditos sin destinación específica. Úsalo para lo que necesites: remodelación, viajes, emprendimiento o emergencias.",
    href: "/creditos-libre-inversion",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=240&fit=crop&q=80&auto=format",
    stats: [
      { label: "Entidades", value: "20+" },
      { label: "Plazo máx.", value: "7 años" },
      { label: "Hasta", value: "$100M" },
    ],
    available: true,
    tags: ["Sin destinación", "Rápido", "Flexible"],
  },
  {
    icon: Shield,
    title: "Créditos Empresariales",
    subtitle: "Impulsa tu negocio",
    description:
      "Capital de trabajo, inversión en activos y más. Próximamente disponible con las mejores opciones del mercado.",
    href: "#",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=240&fit=crop&q=80&auto=format",
    stats: [],
    available: false,
    tags: ["Capital de trabajo", "Activos", "Pymes"],
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

export default function Credits() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* ── Hero ── */}
        <section className="relative pt-24 pb-24 lg:pt-28 lg:pb-28 overflow-hidden">

            {/* Base: deep blue gradient — same as comparator pages */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(145deg,
                hsl(211 53% 6%) 0%,
                hsl(216 89% 11%) 38%,
                hsl(237 70% 18%) 68%,
                hsl(211 53% 8%) 100%)`,
            }}
          />

          {/* Decorative orbs */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.07]"
              style={{ background: `radial-gradient(circle, hsl(var(--secondary)) 0%, transparent 70%)` }}
            />
            <div
              className="absolute -bottom-48 -left-24 w-[600px] h-[600px] rounded-full opacity-[0.05]"
              style={{ background: `radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)` }}
            />
          </div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--primary-foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary-foreground)) 1px, transparent 1px)`,
              backgroundSize: "80px 80px",
            }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center py-8 lg:py-12 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 border"
                  style={{
                    backgroundColor: `hsl(var(--primary-foreground) / 0.08)`,
                    borderColor: `hsl(var(--primary-foreground) / 0.15)`,
                    color: `hsl(var(--primary-foreground) / 0.9)`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Banknote className="w-4 h-4" />
                  Todos los créditos disponibles
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ backgroundColor: `hsl(var(--accent))` }}
                  />
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-black leading-[0.95] tracking-tight mb-5"
                style={{
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  color: `hsl(var(--primary-foreground))`,
                }}
              >
                Explora todos los{" "}
                <span
                  className="relative inline-block"
                  style={{ color: `hsl(var(--accent))` }}
                >
                  créditos
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -bottom-1 left-0 right-0 h-[3px] origin-left rounded-full"
                    style={{ background: `linear-gradient(90deg, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.3) 100%)` }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-base max-w-lg mx-auto leading-relaxed"
                style={{ color: `hsl(var(--primary-foreground) / 0.65)` }}
              >
                Compara tasas y condiciones de todos los tipos de crédito disponibles en Colombia.
                Encuentra el que mejor se ajusta a lo que necesitas.
              </motion.p>
            </div>
          </div>
          {/* ── Wave transition ── */}
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ height: 72 }}>
            {/* Back layer — drifts right, lower opacity */}
            <div className="absolute bottom-0 left-0 animate-wave-fast opacity-40" style={{ width: "200%", height: "100%" }}>
              <svg viewBox="0 0 2880 72" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0,36 C480,8 960,64 1440,36 C1920,8 2400,64 2880,36 L2880,72 L0,72 Z"
                  style={{ fill: "hsl(var(--background))" }}
                />
              </svg>
            </div>
            {/* Front layer — drifts left, full opacity */}
            <div className="absolute bottom-0 left-0 animate-wave-slow" style={{ width: "200%", height: "100%" }}>
              <svg viewBox="0 0 2880 72" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0,48 C360,18 720,68 1080,48 C1440,28 1800,68 2160,48 C2520,28 2700,58 2880,48 L2880,72 L0,72 Z"
                  style={{ fill: "hsl(var(--background))" }}
                />
              </svg>
            </div>
          </div>
        </section>

        {/* ── Credit cards grid ── */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">

            {/* Grid label */}
            <div className="flex items-center justify-between mb-8">
              <p className="text-xs font-semibold text-muted-foreground tracking-widest uppercase">
                Categorías disponibles
              </p>
              <span className="text-xs text-muted-foreground">
                {creditTypes.filter(c => c.available).length} de {creditTypes.length} activos
              </span>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {creditTypes.map((credit, index) => (
                <motion.div
                  key={credit.title}
                  variants={cardVariants}
                  className={`relative rounded-2xl border bg-card overflow-hidden transition-all duration-300 ${
                    index === 0 ? "lg:col-span-2 flex flex-col lg:flex-row" : "flex flex-col"
                  } ${
                    credit.available
                      ? "border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/[0.08] dark:hover:shadow-black/20 cursor-pointer group"
                      : "border-border/50 opacity-70"
                  }`}
                  onClick={() => credit.available && navigate(credit.href)}
                >
                  {/* ── Image ── */}
                  <div className={`relative overflow-hidden bg-muted shrink-0 ${
                    index === 0
                      ? "h-52 lg:h-auto lg:w-[42%]"
                      : "h-44"
                  }`}>
                    <img
                      src={credit.image}
                      alt={credit.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 ${
                      index === 0
                        ? "bg-gradient-to-t from-card/80 via-card/10 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-card/60"
                        : "bg-gradient-to-t from-card/90 via-card/20 to-transparent"
                    }`} />
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.22) 0%, transparent 60%)" }}
                    />
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      {credit.available ? (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary text-white shadow-lg shadow-primary/30 dark:shadow-none">
                          <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                          Disponible
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-brand-sunset text-brand-dark">
                          <Lock className="w-2.5 h-2.5" />
                          Pronto
                        </span>
                      )}
                    </div>
                    {/* Icon chip */}
                    <div
                      className="absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-sm"
                      style={{
                        backgroundColor: credit.available ? "hsl(var(--primary) / 0.18)" : "hsl(var(--muted) / 0.6)",
                        border: `1px solid ${credit.available ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))"}`,
                      }}
                    >
                      <credit.icon
                        className="w-5 h-5"
                        style={{ color: credit.available ? "white" : "hsl(var(--muted-foreground))" }}
                      />
                    </div>
                  </div>

                  {/* ── Content ── */}
                  {index === 0 ? (
                    /* Featured layout — more breathing room, horizontal stats */
                    <div className="p-6 lg:p-8 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-1">{credit.title}</h3>
                        <p className="text-sm font-semibold text-primary mb-4">{credit.subtitle}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                          {credit.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {credit.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                              style={{
                                backgroundColor: "hsl(var(--primary) / 0.07)",
                                color: "hsl(var(--primary))",
                                border: "1px solid hsl(var(--primary) / 0.15)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        {/* Stats — horizontal row with divider */}
                        {credit.stats.length > 0 && (
                          <div className="flex gap-8 py-4 mb-5 border-t border-border">
                            {credit.stats.map((stat) => (
                              <div key={stat.label}>
                                <div className="text-xl font-bold text-primary">{stat.value}</div>
                                <div className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</div>
                              </div>
                            ))}
                          </div>
                        )}
                        <button
                          className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                          onClick={(e) => { e.stopPropagation(); navigate(credit.href); }}
                        >
                          Ver comparador
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Standard layout */
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-[17px] font-bold text-foreground mb-0.5">{credit.title}</h3>
                      <p className="text-[12px] font-semibold text-primary mb-3">{credit.subtitle}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                        {credit.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {credit.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: credit.available ? "hsl(var(--primary) / 0.07)" : "hsl(var(--muted))",
                              color: credit.available ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                              border: `1px solid ${credit.available ? "hsl(var(--primary) / 0.15)" : "hsl(var(--border))"}`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      {credit.available && credit.stats.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-primary/[0.04] border border-primary/[0.08]">
                          {credit.stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                              <div className="text-sm font-bold text-primary">{stat.value}</div>
                              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {credit.available ? (
                        <button
                          className="w-full h-10 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                          onClick={(e) => { e.stopPropagation(); navigate(credit.href); }}
                        >
                          Ver comparador
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full h-10 rounded-xl bg-muted text-muted-foreground/50 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          Próximamente
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
