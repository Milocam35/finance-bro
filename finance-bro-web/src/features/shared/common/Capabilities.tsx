import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CardData {
  number: string;
  category: string;
  title: string;
  description: string;
  image: string;
  available: boolean;
  cta?: string;
  href?: string;
}

const cards: CardData[] = [
  {
    number: "01",
    category: "CRÉDITOS",
    title: "Compara Créditos",
    description:
      "Hipotecarios, vehiculares, educativos y de libre inversión. Compara tasas, cuotas y condiciones de más de 20 entidades — todo en un solo lugar.",
    image: "/images/index/creditos.webp",
    available: true,
    cta: "Comparar ahora",
    href: "/creditos",
  },
  {
    number: "02",
    category: "SIMULADOR",
    title: "Simula tu Cuota",
    description:
      "Ingresa monto y plazo. Ve exactamente cuánto pagarías cada mes con cualquier producto financiero, usando el Sistema Francés con resolución real de tasas.",
    image: "/images/index/analisis.webp",
    available: true,
    cta: "Ir a créditos",
    href: "/creditos",
  },
  {
    number: "03",
    category: "INVERSIONES",
    title: "CDTs e Inversiones",
    description:
      "Haz crecer tu dinero. Encuentra las mejores tasas de rendimiento en CDTs, fondos de inversión y bonos de las principales entidades del país.",
    image: "/images/index/expertos-thumb.webp",
    available: false,
  },
  {
    number: "04",
    category: "TARJETAS",
    title: "Tarjetas de Crédito",
    description:
      "La tarjeta perfecta según tus hábitos. Compara opciones sin anualidad, con cashback, millas y beneficios exclusivos en un solo vistazo.",
    image: "/images/index/gratis-thumb.webp",
    available: false,
  },
  {
    number: "05",
    category: "SEGUROS",
    title: "Seguros",
    description:
      "Protege lo que más importa. Coberturas y precios de las principales aseguradoras del país, comparados con total transparencia.",
    image: "/images/index/transparencia.webp",
    available: false,
  },
];

// ── Individual card driven by scroll progress ──────────────────────────────
function CapabilityCard({
  card,
  index,
  total,
  progress,
}: {
  card: CardData;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const navigate = useNavigate();

  const step = 1 / total;
  const revealAt = index * step;

  // ── Entry: slides up from below into the viewport ──
  const y = useTransform(
    progress,
    [Math.max(0, revealAt - step * 0.7), revealAt],
    ["110%", "0%"]
  );

  // ── After reveal: progressively stack behind newer cards ──
  // Build multi-point breakpoints so each subsequent card causes this one to shrink/shift
  const progressBreaks: number[] = [revealAt];
  const scaleValues: number[] = [1];
  const xValues: number[] = [0];
  const rotValues: number[] = [0];
  const yStackValues: string[] = ["0%"];

  for (let j = index + 1; j <= total; j++) {
    const depth = j - index;
    const atP = Math.min(j * step, 1);
    progressBreaks.push(atP);
    scaleValues.push(Math.max(0.76, 1 - depth * 0.055));
    // Alternate left/right tilt per card for the fan effect
    const tiltDir = index % 2 === 0 ? -1 : 1;
    xValues.push(tiltDir * depth * 14);
    rotValues.push(tiltDir * depth * 1.8);
    yStackValues.push(`${-depth * 2}%`);
  }

  const scale = useTransform(progress, progressBreaks, scaleValues);
  const x = useTransform(progress, progressBreaks, xValues);
  const rotate = useTransform(progress, progressBreaks, rotValues);
  const yStack = useTransform(progress, progressBreaks, yStackValues);

  // Combine entry y and stack y: entry dominates before revealAt, stack after
  const combinedY = index === 0 ? yStack : y;

  return (
    <motion.div
      style={{
        scale,
        x,
        rotate,
        y: combinedY,
        zIndex: index,
      }}
      className="absolute inset-0 m-3 sm:m-6 lg:mx-20 lg:my-10 rounded-3xl overflow-hidden shadow-2xl will-change-transform"
    >
      {/* Background image */}
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
      />

      {/* Gradient overlay — stronger at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />

      {/* Card content */}
      <div className="absolute inset-0 p-6 sm:p-10 lg:p-14 flex flex-col justify-between">
        {/* Top row: number label + badge */}
        <div className="flex items-start justify-between">
          <span className="text-white/55 text-xs font-black tracking-[0.22em] uppercase">
            {card.number} // {card.category}
          </span>
          {!card.available && (
            <span className="flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-brand-sunset text-brand-dark">
              <Lock className="w-2.5 h-2.5" />
              Pronto
            </span>
          )}
          {card.available && (
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-white/15 text-white/90 backdrop-blur-sm">
              Disponible
            </span>
          )}
        </div>

        {/* Bottom: title + description + CTA */}
        <div className="max-w-2xl">
          <h3
            className="font-display font-black text-white leading-[0.95] mb-4"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
          >
            {card.title}
          </h3>
          <p className="text-white/65 text-base sm:text-lg max-w-lg leading-relaxed mb-7">
            {card.description}
          </p>
          {card.available && card.cta && (
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 rounded-xl font-bold shadow-lg group/btn transition-all duration-200 hover:-translate-y-0.5"
              onClick={() => navigate(card.href!)}
            >
              {card.cta}
              <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Section ────────────────────────────────────────────────────────────────
export function Capabilities() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const TOTAL = cards.length;

  return (
    <>
      {/* ── Static header above the scroll region ── */}
      <div className="py-20 lg:py-24 text-center bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[10px] font-semibold text-muted-foreground tracking-[0.18em] uppercase mb-5">
              03 — Herramientas
            </p>
            <h2
              className="font-black text-foreground tracking-tight leading-[0.95] mb-5"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Todo lo que puedes hacer
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Compara, simula e invierte. Gratis, en tiempo real y sin letra pequeña.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll-driven card stack ── */}
      <div
        ref={sectionRef}
        style={{ height: `${TOTAL * 90}dvh` }}
        className="relative"
      >
        <div className="sticky top-0 h-[100dvh] overflow-hidden bg-background">
          {cards.map((card, i) => (
            <CapabilityCard
              key={card.number}
              card={card}
              index={i}
              total={TOTAL}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>

      {/* ── Spacer so next section isn't hidden under sticky ── */}
      <div className="h-16 bg-background" />
    </>
  );
}
