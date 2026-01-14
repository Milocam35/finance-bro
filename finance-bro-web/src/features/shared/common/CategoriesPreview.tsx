import { motion } from "framer-motion";
import { CreditCard, Shield, TrendingUp, Building, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    icon: Building,
    title: "Créditos",
    description: "Hipotecarios, personales, automotriz y más. Compara tasas y encuentra el mejor.",
    items: ["Hipotecarios", "Personales", "Automotriz", "Empresariales"],
    color: "primary",
    available: true,
  },
  {
    icon: Shield,
    title: "Seguros",
    description: "Protege lo que más importa. Compara coberturas y precios de aseguradoras.",
    items: ["Vida", "Auto", "Hogar", "Gastos Médicos"],
    color: "secondary",
    available: false,
  },
  {
    icon: CreditCard,
    title: "Tarjetas de Crédito",
    description: "Encuentra la tarjeta perfecta según tus hábitos de consumo y beneficios.",
    items: ["Sin anualidad", "Cashback", "Millas", "Departamentales"],
    color: "accent",
    available: false,
  },
  {
    icon: TrendingUp,
    title: "Inversiones",
    description: "Haz crecer tu dinero. Compara rendimientos y opciones de inversión.",
    items: ["CDT", "Fondos", "Bonos", "Acciones"],
    color: "primary",
    available: false,
  },
];

export function CategoriesPreview() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Todo lo que necesitas comparar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Un solo lugar para todas tus decisiones financieras
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative group p-6 lg:p-8 rounded-2xl border border-border overflow-hidden ${
                category.available ? "bg-card card-elevated" : "bg-muted/30"
              }`}
            >
              {!category.available && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-xs font-semibold bg-[#FFD60A] text-[#001233] rounded-full">
                    Próximamente
                  </span>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                    category.color === "primary"
                      ? "bg-[#0466C8]/10"
                      : category.color === "secondary"
                      ? "bg-[#0353A4]/10"
                      : "bg-[#FFD60A]/20"
                  }`}
                >
                  <category.icon
                    className={`w-7 h-7 ${
                      category.color === "primary"
                        ? "text-[#0466C8]"
                        : category.color === "secondary"
                        ? "text-[#0353A4]"
                        : "text-[#FFC300]"
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {category.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {category.items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {category.available ? (
                    <Button variant="outline" size="sm" className="group/btn">
                      Explorar
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" disabled>
                      Notificarme cuando esté disponible
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
