import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;
const AUTO_ADVANCE_MS = 5000;

const features = [
  {
    icon: "/brand/icons/svg/porcentaje.svg",
    title: "Información Transparente",
    description:
      "Datos actualizados directamente de los bancos. Sin letras pequeñas ni sorpresas. Información verificada para decisiones financieras seguras.",
    image: "/images/index/transparencia.webp",
    thumb: "/images/index/transparencia.webp",
  },
  {
    icon: "/brand/icons/svg/buscar.svg",
    title: "Comparación Instantánea",
    description:
      "Compara decenas de opciones en segundos. Nuestra plataforma procesa múltiples ofertas y te muestra las más convenientes según tus necesidades.",
    image: "/images/index/comparacion.webp",
    thumb: "/images/index/comparacion.webp",
  },
  {
    icon: "/brand/icons/svg/grafico.svg",
    title: "Análisis Detallado",
    description:
      "CAT, tasas, comisiones y requisitos desglosados por producto. Entiende exactamente qué estás pagando y por qué antes de decidir.",
    image: "/images/index/analisis.webp",
    thumb: "/images/index/analisis.webp",
  },
  {
    icon: "/brand/icons/svg/dinero.svg",
    title: "100% Gratuito",
    description:
      "Sin costo para ti. Sin comisiones ni tarifas ocultas. Tu acceso a información financiera de calidad es completamente libre.",
    image: "/images/index/gratis-thumb.webp",
    thumb: "/images/index/gratis-thumb.webp",
  },
  {
    icon: "/brand/icons/svg/dinero-3.svg",
    title: "Proceso Simplificado",
    description:
      "Te conectamos directamente con el banco, sin intermediarios. Una vez que encuentres el producto ideal, facilitamos el contacto directo.",
    image: "/images/index/proceso-simplificado-thumb.webp",
    thumb: "/images/index/proceso-simplificado-thumb.webp",
  },
  {
    icon: "/brand/icons/svg/grafico-2.svg",
    title: "Expertos Financieros",
    description:
      "Respaldados por especialistas que verifican cada dato. Nuestro equipo asegura la precisión y relevancia de toda la información.",
    image: "/images/index/expertos-thumb.webp",
    thumb: "/images/index/expertos-thumb.webp",
  },
];

/* Stagger container for nav items */
const navContainerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.15 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

function useAutoAdvance(
  interval: number,
  paused: boolean,
  onTick: () => void
) {
  const cb = useRef(onTick);
  cb.current = onTick;
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => cb.current(), interval);
    return () => clearInterval(id);
  }, [paused, interval]);
}

export function Features() {
  const reduced = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  /* preload adjacent images */
  useEffect(() => {
    const toLoad = [
      currentIndex,
      (currentIndex + 1) % features.length,
      (currentIndex - 1 + features.length) % features.length,
    ];
    toLoad.forEach((i) => {
      if (!loadedImages.has(i)) {
        const img = new Image();
        img.src = features[i].image;
        img.onload = () => setLoadedImages((prev) => new Set(prev).add(i));
      }
    });
  }, [currentIndex]);

  /* progress bar rAF */
  useEffect(() => {
    if (paused) return;
    setProgress(0);
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      setProgress(Math.min(elapsed / AUTO_ADVANCE_MS, 1));
      if (elapsed < AUTO_ADVANCE_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [currentIndex, paused]);

  const goTo = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
  };

  useAutoAdvance(AUTO_ADVANCE_MS, paused || !!reduced, () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % features.length);
    setProgress(0);
  });

  /* Slide transition variants — direction-aware */
  const slideVariants = {
    enter: (dir: number) => ({
      x: reduced ? 0 : dir * 40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.45, ease: EASE_OUT_EXPO },
    },
    exit: (dir: number) => ({
      x: reduced ? 0 : dir * -40,
      opacity: 0,
      transition: { duration: 0.28, ease: EASE_OUT_EXPO },
    }),
  };

  /* Watermark number variants — vertical slide */
  const watermarkVariants = {
    enter: { opacity: 0, y: reduced ? 0 : -24 },
    center: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE_OUT_QUINT },
    },
    exit: {
      opacity: 0,
      y: reduced ? 0 : 24,
      transition: { duration: 0.25, ease: EASE_OUT_EXPO },
    },
  };

  const feat = features[currentIndex];

  return (
    <section
      id="features"
      className="relative py-20 lg:py-32 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #07111E 0%, #0a1628 40%, #0d1e38 70%, #07111E 100%)",
      }}
    >
      {/* Wave — top */}
      <div
        className="absolute top-0 left-0 right-0 overflow-hidden z-20 pointer-events-none"
        style={{ height: 72 }}
      >
        <div
          className="absolute top-0 left-0 animate-wave-slow opacity-40"
          style={{ width: "200%", height: "100%" }}
        >
          <svg viewBox="0 0 2880 72" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 L2880,0 L2880,36 C2400,8 1920,64 1440,36 C960,8 480,64 0,36 Z" style={{ fill: "#07111E" }} />
          </svg>
        </div>
        <div
          className="absolute top-0 left-0 animate-wave-fast"
          style={{ width: "200%", height: "100%" }}
        >
          <svg viewBox="0 0 2880 72" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 L2880,0 L2880,48 C2700,18 2520,58 2160,48 C1800,28 1440,68 1080,48 C720,28 360,58 0,48 Z" style={{ fill: "#07111E" }} />
          </svg>
        </div>
      </div>

      {/* ── Floating mesh blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-[20%] left-[10%] w-[60%] h-[60%] rounded-full"
          animate={reduced ? {} : { y: [0, -28, 0], x: [0, 12, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, #303AE4 0%, transparent 65%)",
            filter: "blur(90px)",
            opacity: 0.18,
          }}
        />
        <motion.div
          className="absolute top-[30%] -right-[10%] w-[45%] h-[55%] rounded-full"
          animate={reduced ? {} : { y: [0, 22, 0], x: [0, -16, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          style={{
            background: "radial-gradient(circle, #303AE4 0%, transparent 70%)",
            filter: "blur(80px)",
            opacity: 0.12,
          }}
        />
        <motion.div
          className="absolute -bottom-[10%] left-[30%] w-[50%] h-[50%] rounded-full"
          animate={reduced ? {} : { y: [0, -18, 0], x: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          style={{
            background: "radial-gradient(circle, #FBB347 0%, transparent 65%)",
            filter: "blur(100px)",
            opacity: 0.08,
          }}
        />
      </div>

      {/* Line grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.12 }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="feat-lines" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C2E8FF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#feat-lines)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* ── Section header — staggered reveal ── */}
        <div className="mb-14 text-center">
          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: EASE_OUT_QUINT }}
            className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-5"
            style={{ color: "rgba(194,232,255,0.5)" }}
          >
            02 — Por qué elegirnos
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: reduced ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE_OUT_EXPO }}
            className="font-black tracking-tight leading-[0.95] mb-5 text-white"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Transparencia
            <br />
            primero
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE_OUT_QUINT }}
            className="text-lg max-w-md mx-auto leading-relaxed"
            style={{ color: "rgba(194,232,255,0.65)" }}
          >
            Información real, sin intermediarios. Lo que ves es lo que el banco ofrece.
          </motion.p>
        </div>

        {/* ── Two-panel layout ── */}
        <motion.div
          initial={{ opacity: 0, y: reduced ? 0 : 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* ── Left: feature navigator ── */}
          <div className="lg:w-[34%] flex flex-col gap-1">

            {/* Mobile: horizontal tab strip */}
            <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 scrollbar-none">
              {features.map((f, i) => (
                <motion.button
                  key={i}
                  onClick={() => goTo(i)}
                  whileTap={reduced ? {} : { scale: 0.95 }}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    i === currentIndex
                      ? "bg-white/10 text-white border border-white/20"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  <img
                    src={f.icon}
                    alt=""
                    className="w-3.5 h-3.5 object-contain brightness-0 invert opacity-70"
                  />
                  {f.title.split(" ")[0]}
                </motion.button>
              ))}
            </div>

            {/* Desktop: vertical numbered list with stagger entrance */}
            <motion.div
              className="hidden lg:flex flex-col gap-0.5"
              variants={navContainerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {features.map((f, i) => {
                const isActive = i === currentIndex;
                return (
                  <motion.button
                    key={i}
                    variants={navItemVariants}
                    onClick={() => goTo(i)}
                    whileHover={reduced ? {} : { x: 3 }}
                    whileTap={reduced ? {} : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="relative flex items-center gap-4 px-4 py-3.5 rounded-xl text-left group"
                  >
                    {/* Active bg — spring-driven layoutId pill */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active-bg"
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(48,58,228,0.18) 0%, rgba(194,232,255,0.06) 100%)",
                          border: "1px solid rgba(48,58,228,0.3)",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Step number */}
                    <span
                      className={`relative z-10 font-mono text-[11px] tracking-widest transition-colors duration-200 w-7 shrink-0 ${
                        isActive ? "text-[#303AE4]" : "text-white/20 group-hover:text-white/40"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Icon container — scales up when active */}
                    <motion.div
                      animate={
                        reduced
                          ? {}
                          : { scale: isActive ? 1.1 : 1, backgroundColor: isActive ? "rgba(48,58,228,0.2)" : "rgba(255,255,255,0.05)" }
                      }
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      className="relative z-10 w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    >
                      <img
                        src={f.icon}
                        alt=""
                        className="w-3.5 h-3.5 object-contain brightness-0 invert opacity-80"
                      />
                    </motion.div>

                    {/* Title */}
                    <span
                      className={`relative z-10 text-sm font-semibold leading-tight transition-colors duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-white/40 group-hover:text-white/70"
                      }`}
                    >
                      {f.title}
                    </span>

                    {/* Active right accent — spring layoutId */}
                    {isActive && (
                      <motion.div
                        layoutId="nav-accent"
                        className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-8 rounded-full bg-[#303AE4]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </div>

          {/* ── Right: showcase card ── */}
          <div className="lg:w-[66%]">
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              whileHover={reduced ? {} : { y: -3, transition: { duration: 0.3, ease: EASE_OUT_QUINT } }}
              style={{
                boxShadow: "0 32px 64px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
              }}
            >
              {/* Progress bar */}
              {!reduced && (
                <div className="absolute top-0 left-0 right-0 z-30 h-[2px] bg-white/10">
                  <motion.div
                    className="h-full bg-[#303AE4]"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              )}

              {/* Image area */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9] bg-[#07111E] overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0"
                  >
                    {/* Thumb placeholder */}
                    <img
                      src={feat.thumb}
                      alt=""
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                        loadedImages.has(currentIndex) ? "opacity-0" : "opacity-100"
                      }`}
                      aria-hidden="true"
                    />

                    {/* Full image — Ken Burns subtle zoom while active */}
                    <motion.img
                      key={`img-${currentIndex}`}
                      src={feat.image}
                      alt={feat.title}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                        loadedImages.has(currentIndex) ? "opacity-100" : "opacity-0"
                      }`}
                      initial={{ scale: 1 }}
                      animate={reduced ? {} : { scale: 1.06 }}
                      transition={{
                        duration: AUTO_ADVANCE_MS / 1000,
                        ease: "linear",
                      }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07111E] via-[#07111E]/30 to-transparent" />
                  </motion.div>
                </AnimatePresence>

                {/* Watermark step — vertical slide between slides */}
                <div
                  className="absolute top-4 right-5 font-mono font-black leading-none pointer-events-none select-none z-10 overflow-hidden"
                  style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)", letterSpacing: "-0.04em" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={`wm-${currentIndex}`}
                      variants={watermarkVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="block"
                      style={{ color: "rgba(194,232,255,0.07)" }}
                    >
                      {String(currentIndex + 1).padStart(2, "0")}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* Brand icon badge — pops in on slide change */}
                <div className="absolute top-4 left-4 z-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`badge-${currentIndex}`}
                      initial={{ scale: reduced ? 1 : 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: reduced ? 1 : 0.8, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 24, delay: 0.15 }}
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{
                        background: "rgba(48,58,228,0.25)",
                        border: "1px solid rgba(48,58,228,0.4)",
                        backdropFilter: "blur(8px)",
                        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
                      }}
                    >
                      <img
                        src={feat.icon}
                        alt=""
                        className="w-4 h-4 object-contain brightness-0 invert"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Glassmorphism content panel */}
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`content-${currentIndex}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute bottom-0 left-0 right-0 z-10 p-3 sm:p-5 lg:p-7"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(7,17,30,0.95) 0%, rgba(7,17,30,0.7) 100%)",
                      backdropFilter: "blur(12px)",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                  >
                    <h3
                      className="font-black text-white leading-tight mb-1 sm:mb-2"
                      style={{ fontSize: "clamp(1rem, 2.5vw, 1.4rem)" }}
                    >
                      {feat.title}
                    </h3>
                    <p
                      className="hidden sm:block leading-relaxed text-sm lg:text-base"
                      style={{ color: "rgba(194,232,255,0.65)" }}
                    >
                      {feat.description}
                    </p>

                    {/* Mobile dot indicators */}
                    <div className="flex items-center gap-1.5 mt-2 sm:mt-4 lg:hidden">
                      {features.map((_, i) => (
                        <motion.button
                          key={i}
                          onClick={() => goTo(i)}
                          animate={reduced ? {} : { width: i === currentIndex ? 24 : 4 }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          className={`h-1 rounded-full ${
                            i === currentIndex ? "bg-[#303AE4]" : "bg-white/20"
                          }`}
                          style={{ width: i === currentIndex ? 24 : 4 }}
                          aria-label={`Ir a característica ${i + 1}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Wave — bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden z-20 pointer-events-none"
        style={{ height: 72 }}
      >
        <div
          className="absolute bottom-0 left-0 animate-wave-fast opacity-40"
          style={{ width: "200%", height: "100%" }}
        >
          <svg viewBox="0 0 2880 72" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,36 C480,8 960,64 1440,36 C1920,8 2400,64 2880,36 L2880,72 L0,72 Z" style={{ fill: "hsl(var(--background))" }} />
          </svg>
        </div>
        <div
          className="absolute bottom-0 left-0 animate-wave-slow"
          style={{ width: "200%", height: "100%" }}
        >
          <svg viewBox="0 0 2880 72" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,48 C360,18 720,68 1080,48 C1440,28 1800,68 2160,48 C2520,28 2700,58 2880,48 L2880,72 L0,72 Z" style={{ fill: "hsl(var(--background))" }} />
          </svg>
        </div>
      </div>
    </section>
  );
}
