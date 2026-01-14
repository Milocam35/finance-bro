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
    <section id="features" className="py-16 lg:py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¿Por qué elegirnos?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Somos tu aliado para tomar las mejores decisiones financieras
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group p-6 bg-card rounded-2xl border border-border card-elevated"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0466C8]/10 flex items-center justify-center mb-4 group-hover:bg-[#0466C8]/20 transition-colors">
                <feature.icon className="w-6 h-6 text-[#0466C8]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
