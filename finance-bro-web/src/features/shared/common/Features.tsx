import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Zap, BarChart3, Users, Clock, Award, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Shield,
    title: "Información Transparente",
    description:
      "Datos actualizados directamente de los bancos. Sin letras pequeñas ni sorpresas. Accede a información verificada y confiable que te permite tomar decisiones financieras informadas con total seguridad.",
    image: "/images/index/transparente.webp",
    thumb: "/images/index/transparente-thumb.webp",
  },
  {
    icon: Zap,
    title: "Comparación Instantánea",
    description:
      "Compara decenas de opciones en segundos. Ahorra tiempo y encuentra lo mejor. Nuestra plataforma procesa múltiples ofertas simultáneamente para mostrarte las opciones más convenientes según tus necesidades.",
    image: "/images/index/comparacion.webp",
    thumb: "/images/index/comparacion-thumb.webp",
  },
  {
    icon: BarChart3,
    title: "Análisis Detallado",
    description:
      "CAT, tasas, comisiones y requisitos desglosados para cada producto financiero. Visualiza cada componente del costo total de tu crédito y entiende exactamente qué estás pagando y por qué.",
    image: "/images/index/analisis-detallado.webp",
    thumb: "/images/index/analisis-detallado-thumb.webp",
  },
  {
    icon: Users,
    title: "100% Gratuito",
    description:
      "Sin costo para ti. Nuestro servicio es completamente gratuito para usuarios. No cobramos comisiones ni tarifas ocultas. Tu acceso a información financiera de calidad es totalmente libre.",
    image: "/images/index/gratis.webp",
    thumb: "/images/index/gratis-thumb.webp",
  },
  {
    icon: Clock,
    title: "Proceso Simplificado",
    description:
      "Te conectamos directamente con el banco. Sin intermediarios innecesarios. Una vez que encuentres el producto ideal, te facilitamos el contacto directo con la entidad financiera para agilizar tu solicitud.",
    image: "/images/index/proceso-simplificado.webp",
    thumb: "/images/index/proceso-simplificado-thumb.webp",
  },
  {
    icon: Award,
    title: "Expertos Financieros",
    description:
      "Respaldados por especialistas que verifican cada dato y recomendación. Nuestro equipo de analistas financieros trabaja constantemente para asegurar la precisión y relevancia de toda la información.",
    image: "/images/index/expertos.webp",
    thumb: "/images/index/expertos-thumb.webp",
  },
];

export function Features() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // Precargar solo la primera

  // Precargar imagen actual y las adyacentes
  useEffect(() => {
    const imagesToLoad = [
      currentIndex,
      (currentIndex + 1) % features.length,
      (currentIndex - 1 + features.length) % features.length,
    ];

    imagesToLoad.forEach((index) => {
      if (!loadedImages.has(index)) {
        const img = new Image();
        img.src = features[index].image;
        img.onload = () => {
          setLoadedImages((prev) => new Set(prev).add(index));
        };
      }
    });
  }, [currentIndex, loadedImages]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <section id="features" className="relative py-12 lg:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Somos tu aliado para tomar las mejores decisiones financieras
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Carrusel con imagen y texto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Contenedor del carrusel */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-full"
                >
                  <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-lg overflow-hidden will-change-transform">
                    {/* Layout responsive: columna en móvil, fila en desktop */}
                    <div className="flex flex-col lg:flex-row lg:items-center">
                      {/* Imagen a la izquierda en desktop */}
                      <div className="lg:w-2/5 relative">
                        <div className="relative aspect-[4/3] lg:aspect-[3/4] bg-muted overflow-hidden">
                          {/* Thumbnail como placeholder (carga rápida) */}
                          <img
                            src={features[currentIndex].thumb}
                            alt=""
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                              loadedImages.has(currentIndex) ? 'opacity-0' : 'opacity-100'
                            }`}
                            loading="eager"
                            decoding="async"
                            aria-hidden="true"
                          />
                          {/* Imagen principal (alta calidad) */}
                          <img
                            src={features[currentIndex].image}
                            alt={features[currentIndex].title}
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                              loadedImages.has(currentIndex) ? 'opacity-100' : 'opacity-0'
                            }`}
                            loading="eager"
                            decoding="async"
                          />
                          {/* Overlay decorativo */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/20" />
                        </div>
                      </div>

                      {/* Contenido del texto a la derecha en desktop */}
                      <div className="lg:w-3/5 p-6 lg:p-8 flex flex-col justify-center">
                        {/* Icono - visible solo en móvil */}
                        <div className="w-14 h-14 rounded-xl bg-[#0466C8]/10 flex items-center justify-center mb-5 lg:hidden">
                          {(() => {
                            const Icon = features[currentIndex].icon;
                            return <Icon className="w-7 h-7 text-[#0466C8]" />;
                          })()}
                        </div>

                        {/* Título */}
                        <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                          {features[currentIndex].title}
                        </h3>

                        {/* Descripción */}
                        <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-6">
                          {features[currentIndex].description}
                        </p>

                        {/* Indicadores de posición */}
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          {features.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentIndex(index)}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentIndex
                                  ? "w-8 bg-[#0466C8]"
                                  : "w-2 bg-border hover:bg-[#0466C8]/50"
                              }`}
                              aria-label={`Ir a característica ${index + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Botones de navegación */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none z-20">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevSlide}
                  className="pointer-events-auto -ml-4 lg:-ml-16 rounded-full bg-card/90 backdrop-blur-sm border-border hover:bg-[#0466C8] hover:text-white hover:border-[#0466C8] transition-all duration-300 shadow-xl"
                  aria-label="Característica anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextSlide}
                  className="pointer-events-auto -mr-4 lg:-mr-16 rounded-full bg-card/90 backdrop-blur-sm border-border hover:bg-[#0466C8] hover:text-white hover:border-[#0466C8] transition-all duration-300 shadow-xl"
                  aria-label="Característica siguiente"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Contador */}
            <div className="text-center mt-5">
              <span className="text-sm text-muted-foreground font-medium">
                {currentIndex + 1} / {features.length}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
