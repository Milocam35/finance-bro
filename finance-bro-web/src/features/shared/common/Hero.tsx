import { motion } from "framer-motion";
import { Search, TrendingDown, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { value: "25+", label: "Bancos", icon: Shield },
  { value: "50K+", label: "Usuarios", icon: Clock },
  { value: "$5.000M+", label: "Ahorrados", icon: TrendingDown },
];

// Partículas flotantes estéticas
const particles = [
  { size: 4, x: "10%", y: "20%", duration: 8, delay: 0 },
  { size: 6, x: "85%", y: "15%", duration: 10, delay: 1 },
  { size: 3, x: "70%", y: "60%", duration: 7, delay: 2 },
  { size: 5, x: "20%", y: "70%", duration: 9, delay: 0.5 },
  { size: 4, x: "90%", y: "80%", duration: 11, delay: 1.5 },
  { size: 3, x: "5%", y: "50%", duration: 8, delay: 3 },
  { size: 5, x: "50%", y: "10%", duration: 10, delay: 2.5 },
  { size: 4, x: "35%", y: "85%", duration: 9, delay: 1 },
];

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#001233]">
      {/* Fondo sólido base */}
      <div className="absolute inset-0 bg-[#001233]" />

      {/* Olas decorativas en el fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Ola 1 - más atrás */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          style={{ height: "60%" }}
        >
          <path
            d="M0,320 C180,280 360,200 540,200 C720,200 900,280 1080,300 C1260,320 1380,280 1440,260 L1440,400 L0,400 Z"
            fill="#002855"
            fillOpacity="0.4"
          />
        </svg>

        {/* Ola 2 - intermedia */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          style={{ height: "50%" }}
        >
          <path
            d="M0,350 C240,300 480,220 720,240 C960,260 1200,340 1440,300 L1440,400 L0,400 Z"
            fill="#0353A4"
            fillOpacity="0.3"
          />
        </svg>

        {/* Ola 3 - más al frente */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          style={{ height: "40%" }}
        >
          <path
            d="M0,380 C360,340 720,280 1080,320 C1260,340 1380,360 1440,350 L1440,400 L0,400 Z"
            fill="#0466C8"
            fillOpacity="0.25"
          />
        </svg>
      </div>

      {/* Partículas flotantes */}
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-white/20"
          style={{
            width: particle.size,
            height: particle.size,
            left: particle.x,
            top: particle.y,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Elementos geométricos flotantes */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[15%] w-16 h-16 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 left-[8%] w-12 h-12 rounded-full border border-[#0466C8]/30 bg-[#0466C8]/10 hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/3 left-[12%] w-8 h-8 rounded-lg border border-[#FFD60A]/20 bg-[#FFD60A]/5 hidden lg:block"
      />

      <div className="container mx-auto px-4 relative z-10 pt-32 pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FFD60A] animate-pulse" />
              Compara y ahorra en minutos
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Encuentra el crédito
            <br />
            <span className="text-[#FFD60A]">perfecto para ti</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto"
          >
            Compara tasas, plazos y requisitos de todas las entidades financieras en un solo lugar.
            Toma decisiones financieras inteligentes con información transparente.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Button
              size="lg"
              onClick={() => navigate('/creditos-hipotecarios')}
              className="bg-[#0466C8] hover:bg-[#0353A4] text-white font-semibold px-8 h-14 text-base shadow-lg shadow-[#0466C8]/30 transition-all duration-300"
            >
              <Search className="w-5 h-5 mr-2" />
              Comparar Créditos Hipotecarios
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const featuresSection = document.getElementById('features');
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="border-2 border-white/40 text-white hover:bg-white/15 hover:border-white/60 h-14 text-base font-semibold backdrop-blur-sm bg-white/5 transition-all duration-300"
            >
              ¿Cómo funciona?
            </Button>
          </motion.div>

          {/* Carta de Entidades Financieras */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 mb-20 max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md p-8 shadow-2xl">
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0466C8]/10 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <p className="text-white/70 text-sm font-medium mb-2">Información de</p>  
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    +20 Entidades Financieras
                  </h3>
                  <p className="text-white/60 text-sm">
                    Bancos, Compañias de financiamiento y otras instituciones
                  </p>
                </div>

                {/* Grid de logos/nombres de bancos */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                  {[
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
                  ].map((bank, index) => (
                    <motion.div
                      key={bank.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                      className="flex items-center justify-center p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/20 transition-all duration-300"
                    >
                      <img
                        src={bank.logo}
                        alt={bank.name}
                        className="h-6 md:h-8 w-auto object-contain filter brightness-0 invert opacity-80"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const span = document.createElement('span');
                            span.className = 'text-white/80 text-xs md:text-sm font-medium text-center';
                            span.textContent = bank.name;
                            parent.appendChild(span);
                          }
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
 
                <p className="text-center text-white/50 text-xs mt-6">
                  Y muchas más...
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Transición suave hacia la siguiente sección */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
