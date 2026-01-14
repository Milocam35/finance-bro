import { Search, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  productos: [
    { label: "Créditos Hipotecarios", href: "#hipotecarios" },
    { label: "Créditos Personales", href: "#personales" },
    { label: "Seguros", href: "#seguros" },
    { label: "Tarjetas de Crédito", href: "#tarjetas" },
    { label: "Inversiones", href: "#inversiones" },
  ],
  recursos: [
    { label: "Centro de Ayuda", href: "#" },
    { label: "Blog Financiero", href: "#" },
    { label: "Calculadoras", href: "#" },
    { label: "Glosario", href: "#" },
    { label: "Preguntas Frecuentes", href: "#" },
  ],
  empresa: [
    { label: "Sobre Nosotros", href: "#" },
    { label: "Cómo Funciona", href: "#" },
    { label: "Trabaja con Nosotros", href: "#" },
    { label: "Prensa", href: "#" },
    { label: "Contacto", href: "#" },
  ],
  legal: [
    { label: "Términos y Condiciones", href: "#" },
    { label: "Aviso de Privacidad", href: "#" },
    { label: "Política de Cookies", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-0">
              <span className="text-2xl font-bold tracking-tight leading-none inline-flex items-baseline py-4" style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 900 }}>
                <span className="text-primary-foreground">Finance</span>
                <span className="text-[#FFD60A]">Br</span>
                <span className="inline-flex items-center justify-center" style={{ marginLeft: '0.03em', transform: 'translateY(3px)' }}>
                  <Search className="text-[#FFD60A]" size={20} strokeWidth={4} />
                </span>
              </span>
            </a>
            <p className="text-primary-foreground/70 text-sm mb-6 max-w-sm">
              Tu plataforma de comparación financiera. Encuentra los mejores
              productos financieros de forma transparente y gratuita.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contacto@financebro.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +57 (1) 234-5678
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Bogotá, Colombia
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Productos</h4>
            <ul className="space-y-2">
              {footerLinks.productos.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              {footerLinks.recursos.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            © {new Date().getFullYear()} FinanceBro. Todos los derechos reservados.
          </p>
          <p className="text-xs text-primary-foreground/40 max-w-lg text-center md:text-right">
            La información presentada es de carácter informativo. Los términos y
            condiciones finales son establecidos por cada institución financiera.
          </p>
        </div>
      </div>
    </footer>
  );
}
