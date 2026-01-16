import { motion } from "framer-motion";
import { Shield, Zap, BarChart3, Users, Clock, Award } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Información Transparente",
    description:
      "Datos actualizados directamente de los bancos. Sin letras pequeñas ni sorpresas.",
  },
  {
    icon: Zap,
    title: "Comparación Instantánea",
    description:
      "Compara decenas de opciones en segundos. Ahorra tiempo y encuentra lo mejor.",
  },
  {
    icon: BarChart3,
    title: "Análisis Detallado",
    description:
      "CAT, tasas, comisiones y requisitos desglosados para cada producto financiero.",
  },
  {
    icon: Users,
    title: "100% Gratuito",
    description:
      "Sin costo para ti. Nuestro servicio es completamente gratuito para usuarios.",
  },
  {
    icon: Clock,
    title: "Proceso Simplificado",
    description:
      "Te conectamos directamente con el banco. Sin intermediarios innecesarios.",
  },
  {
    icon: Award,
    title: "Expertos Financieros",
    description:
      "Respaldados por especialistas que verifican cada dato y recomendación.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Somos tu aliado para tomar las mejores decisiones financieras
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                scale: 1.02,
                y: -4,
                transition: { duration: 0.2 }
              }}
              className="group relative p-4 bg-card/80 backdrop-blur-sm rounded-xl border border-border card-elevated hover:shadow-lg hover:border-[#0466C8]/30 transition-all duration-300"
            >
              {/* Gradiente de fondo en hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0466C8]/0 to-[#0466C8]/0 group-hover:from-[#0466C8]/5 group-hover:to-transparent rounded-xl transition-all duration-300" />

              <div className="flex items-start gap-3 relative z-10">
                <motion.div
                  className="w-10 h-10 rounded-lg bg-[#0466C8]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0466C8]/20 transition-colors"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-5 h-5 text-[#0466C8] group-hover:scale-110 transition-transform" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-[#0466C8] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-snug">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Indicador de brillo en la esquina */}
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0466C8]/0 group-hover:bg-[#0466C8]/50 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
