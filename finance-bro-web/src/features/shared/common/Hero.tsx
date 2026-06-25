import { motion, useReducedMotion } from "framer-motion";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { memo } from "react";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: "25+", label: "Bancos" },
  { value: "50K+", label: "Usuarios" },
  { value: "$5.000M+", label: "Ahorrados" },
];

const banks = [
  { name: "Bancolombia", logo: "/images/banks/bancolombia.png" },
  { name: "Davivienda", logo: "/images/banks/davivienda.png" },
  { name: "BBVA", logo: "/images/banks/bbva.png" },
  { name: "Scotiabank", logo: "/images/banks/davibank.jpg" },
  { name: "Itaú", logo: "/images/banks/itau.png" },
  { name: "Lulo Bank", logo: "/images/banks/lulobank.png" },
  { name: "Nu", logo: "/images/banks/nu.svg" },
  { name: "Credifamilia", logo: "/images/banks/credifamilia.png" },
  { name: "KOA", logo: "/images/banks/koa.png" },
  { name: "IRIS", logo: "/images/banks/iris.png" },
];

const BankGrid = memo(function BankGrid({ isDark }: { isDark: boolean }) {
  const reduced = useReducedMotion();

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
      {banks.map((bank, i) => (
        <div
          key={bank.name}
          className="flex items-center justify-center h-[48px] sm:h-[60px] rounded-xl overflow-hidden"
          style={{
            background: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.9)",
            border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.07)",
            boxShadow: isDark ? "0 6px 20px rgba(0,0,0,0.4)" : "0 3px 12px rgba(48,58,228,0.08)",
            animation: reduced ? "none" : `float-bank ${2.8 + i * 0.22}s ease-in-out ${i * 0.18}s infinite`,
            willChange: reduced ? "auto" : "transform",
          }}
        >
          <img
            src={bank.logo}
            alt={bank.name}
            className={`h-5 sm:h-6 w-auto max-w-[80%] object-contain ${
              isDark ? "brightness-0 invert opacity-55" : "opacity-60"
            }`}
            loading="eager"
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              const p = el.parentElement;
              if (p) {
                const s = document.createElement("span");
                s.className = "text-[9px] font-medium text-center px-1 leading-tight";
                s.style.color = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)";
                s.textContent = bank.name;
                p.appendChild(s);
              }
            }}
          />
        </div>
      ))}
    </div>
  );
});

export function Hero() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const reduced = useReducedMotion();

  /* Shared entrance config */
  const fadeUp = (delay: number, duration = 0.55) => ({
    initial: { opacity: 0, y: reduced ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration, delay, ease: EASE_OUT_QUINT },
  });

  return (
    <section className="relative overflow-hidden bg-muted/30 dark:bg-[#07111E]">

      {/* ── Dark mode: colored mesh blobs ── */}
      <div className="hidden dark:block absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[15%] left-[15%] w-[75%] h-[75%] rounded-full"
          style={{ background: "radial-gradient(circle, #303AE4 0%, transparent 65%)", filter: "blur(72px)", opacity: 0.68 }} />
        <div className="absolute top-[25%] -right-[15%] w-[55%] h-[60%] rounded-full"
          style={{ background: "radial-gradient(circle, #303AE4 0%, transparent 70%)", filter: "blur(60px)", opacity: 0.45 }} />
        <div className="absolute top-[5%] left-[30%] w-[45%] h-[45%] rounded-full"
          style={{ background: "radial-gradient(circle, #C2E8FF 0%, transparent 65%)", filter: "blur(64px)", opacity: 0.28 }} />
        <div className="absolute -bottom-[10%] -left-[5%] w-[45%] h-[55%] rounded-full"
          style={{ background: "radial-gradient(circle, #FBB347 0%, transparent 65%)", filter: "blur(80px)", opacity: 0.42 }} />
        <div className="absolute -bottom-[20%] right-[5%] w-[55%] h-[55%] rounded-full"
          style={{ background: "radial-gradient(circle, #052659 0%, transparent 65%)", filter: "blur(60px)", opacity: 0.7 }} />
        <div className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, #07111E 100%)", opacity: 0.5 }} />
      </div>

      {/* ── Light mode: neutral bubbles + grid ── */}
      <div className="dark:hidden absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] left-[10%] w-[65%] h-[70%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(48,58,228,0.05) 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-[10%] right-[5%] w-[50%] h-[60%] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(251,179,71,0.05) 0%, transparent 65%)", filter: "blur(90px)" }} />
        <div className="absolute inset-0 opacity-[0.35]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>
      </div>

      {/* ── Floating geometric accents (CSS animations — no Framer overhead) ── */}
      <div
        className="absolute top-1/4 right-[14%] w-14 h-14 rounded-2xl hidden lg:block"
        style={{
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid hsl(var(--border))",
          backgroundColor: isDark ? "rgba(255,255,255,0.03)" : "rgba(48,58,228,0.04)",
          animation: reduced ? "none" : "float-accent-a 6.5s ease-in-out infinite",
          willChange: reduced ? "auto" : "transform",
        }}
      />
      <div
        className="absolute bottom-1/3 left-[7%] w-10 h-10 rounded-full hidden lg:block border border-brand-sunset/20 bg-brand-sunset/[0.05]"
        style={{
          animation: reduced ? "none" : "float-accent-b 5.5s ease-in-out 1.2s infinite",
          willChange: reduced ? "auto" : "transform",
        }}
      />
      <div
        className="absolute top-[38%] left-[11%] w-7 h-7 rounded-lg hidden lg:block"
        style={{
          border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid hsl(var(--border))",
          backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(48,58,228,0.03)",
          animation: reduced ? "none" : "float-accent-c 7s ease-in-out 2.5s infinite",
          willChange: reduced ? "auto" : "transform",
        }}
      />

      <div className="container mx-auto px-4 relative z-10 pt-20 lg:pt-32 pb-0">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <motion.div {...fadeUp(0, 0.45)}>
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm border border-brand-sunset/40"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(251,179,71,0.08)",
                color: isDark ? "rgba(255,255,255,0.9)" : "hsl(var(--foreground))",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-brand-sunset animate-pulse" />
              Gratis · Sin registro
            </span>
          </motion.div>

          {/* Imagotipo — hero moment, enters with scale + bigger y-offset */}
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 44, scale: reduced ? 1 : 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.85, delay: 0.12, ease: EASE_OUT_EXPO }}
            className="mb-6 flex justify-center"
          >
            <motion.img
              src={isDark ? "/brand/logos/png/imagotipo-negativo.png" : "/brand/logos/png/imagotipo-color.png"}
              alt="FinanceBro"
              animate={reduced ? {} : { y: [0, -10, 0], rotate: [-0.4, 0.4, -0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full max-w-[360px] sm:max-w-[460px] lg:max-w-[560px] h-auto select-none"
              draggable={false}
            />
          </motion.div>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.38)}
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed text-muted-foreground dark:text-[rgba(194,232,255,0.65)]"
          >
            Tasas, plazos y condiciones de +20 bancos colombianos en un solo lugar.
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...fadeUp(0.5)}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <motion.div
              whileHover={reduced ? {} : { scale: 1.04, y: -2 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
              transition={{ duration: 0.18, ease: EASE_OUT_QUINT }}
            >
              <Button
                size="lg"
                onClick={() => navigate('/creditos')}
                className="bg-brand-sunset hover:bg-brand-sunset/90 text-brand-dark font-bold px-8 py-3 h-auto rounded-xl shadow-lg shadow-brand-sunset/25 transition-shadow duration-300"
              >
                <Search className="w-5 h-5 mr-2" />
                Comparar Créditos
              </Button>
            </motion.div>

            <motion.div
              whileHover={reduced ? {} : { scale: 1.03, y: -2 }}
              whileTap={reduced ? {} : { scale: 0.97 }}
              transition={{ duration: 0.18, ease: EASE_OUT_QUINT }}
            >
              <Button
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="font-semibold px-8 py-3 h-auto rounded-xl border border-border bg-muted/50 hover:bg-muted text-foreground dark:border-white/25 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] dark:text-white dark:backdrop-blur-sm"
              >
                ¿Cómo funciona?
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats — each enters with a pop, staggered */}
          <div className="flex justify-center items-center gap-0 mb-12">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: reduced ? 1 : 0.8, y: reduced ? 0 : 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.62 + i * 0.1, ease: EASE_OUT_EXPO }}
                  className="text-center px-3 sm:px-8 lg:px-12"
                >
                  <p className="text-2xl sm:text-4xl lg:text-6xl font-display font-bold tabular leading-none text-foreground dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] mt-2 text-muted-foreground dark:text-[rgba(194,232,255,0.5)]">
                    {stat.label}
                  </p>
                </motion.div>
                {i < stats.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, scaleY: reduced ? 1 : 0 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    transition={{ duration: 0.4, delay: 0.68 + i * 0.1, ease: EASE_OUT_QUINT }}
                    className="w-px h-12 bg-border dark:bg-white/15 origin-center"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Bank grid — staggered entrance */}
          <motion.div
            initial={{ opacity: 0, y: reduced ? 0 : 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.88, ease: EASE_OUT_QUINT }}
            className="w-full"
          >
            <div className="text-center mb-6">
              <p className="text-sm font-medium mb-4 text-muted-foreground dark:text-[rgba(194,232,255,0.5)] uppercase tracking-widest">
                +20 entidades financieras
              </p>
            </div>
            <BankGrid isDark={isDark} />
          </motion.div>
        </div>
      </div>

      <div className="h-16 mt-8" />
    </section>
  );
}
