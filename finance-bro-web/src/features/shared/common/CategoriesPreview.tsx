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
    image: "/images/index/creditos.webp",
  },
  {
    icon: Shield,
    title: "Seguros",
    description: "Protege lo que más importa. Compara coberturas y precios de aseguradoras.",
    items: ["Vida", "Auto", "Hogar", "Gastos Médicos"],
    color: "secondary",
    available: false,
    image: null,
  },
  {
    icon: CreditCard,
    title: "Tarjetas de Crédito",
    description: "Encuentra la tarjeta perfecta según tus hábitos de consumo y beneficios.",
    items: ["Sin anualidad", "Cashback", "Millas", "Departamentales"],
    color: "accent",
    available: false,
    image: null,
  },
  {
    icon: TrendingUp,
    title: "Inversiones",
    description: "Haz crecer tu dinero. Compara rendimientos y opciones de inversión.",
    items: ["CDT", "Fondos", "Bonos", "Acciones"],
    color: "primary",
    available: false,
    image: null,
  },
];

export function CategoriesPreview() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background to-muted/20">
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

        {/* Grid: 1 columna en móvil, 2 en tablet, 4 en desktop */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative group rounded-2xl border border-border overflow-hidden ${
                category.available ? "bg-card card-elevated" : "bg-muted/30"
              }`}
            >
              {/* Badge "Próximamente" */}
              {!category.available && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 text-xs font-semibold bg-[#FFD60A] text-[#001233] rounded-full shadow-lg">
                    Próximamente
                  </span>
                </div>
              )}

              {/* Imagen en la parte superior */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                {category.image ? (
                  <>
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </>
                ) : (
                  // Placeholder con icono para categorías sin imagen
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
                        category.color === "primary"
                          ? "bg-[#0466C8]/20"
                          : category.color === "secondary"
                          ? "bg-[#0353A4]/20"
                          : "bg-[#FFD60A]/30"
                      }`}
                    >
                      <category.icon
                        className={`w-10 h-10 ${
                          category.color === "primary"
                            ? "text-[#0466C8]"
                            : category.color === "secondary"
                            ? "text-[#0353A4]"
                            : "text-[#FFC300]"
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Contenido de la carta */}
              <div className="p-5">
                {/* Título */}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {category.title}
                </h3>

                {/* Descripción */}
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>

                {/* Items/Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {category.items.slice(0, 3).map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {item}
                    </span>
                  ))}
                  {category.items.length > 3 && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      +{category.items.length - 3}
                    </span>
                  )}
                </div>

                {/* Botón */}
                {category.available ? (
                  <Button variant="outline" size="sm" className="w-full group/btn">
                    Explorar
                    <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="w-full" disabled>
                    Notificarme
                  </Button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
