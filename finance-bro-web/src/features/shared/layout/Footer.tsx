import { Search, Mail, MapPin } from "lucide-react";

const footerLinks = {
  productos: [
    { label: "Créditos Hipotecarios", href: "/creditos-hipotecarios" },
    { label: "Créditos Personales", href: "#personales" },
    { label: "Seguros", href: "#seguros" },
    { label: "Tarjetas de Crédito", href: "#tarjetas" },
    { label: "Inversiones", href: "#inversiones" },
  ],
  empresa: [
    { label: "Sobre Nosotros", href: "#nosotros" },
    { label: "Cómo Funciona", href: "#features" },
    { label: "Contacto", href: "#contacto" },
  ],
  legal: [
    { label: "Términos y Condiciones", href: "#terminos" },
    { label: "Aviso de Privacidad", href: "#privacidad" },
    { label: "Política de Cookies", href: "#cookies" },
  ],
};

// Componentes SVG para iconos de redes sociales oficiales
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const socialLinks = [
  { Icon: FacebookIcon, href: "#", label: "Facebook" },
  { Icon: XIcon, href: "#", label: "X (Twitter)" },
  { Icon: InstagramIcon, href: "#", label: "Instagram" },
  { Icon: LinkedinIcon, href: "#", label: "LinkedIn" },
  { Icon: TikTokIcon, href: "#", label: "TikTok" },
];

export function Footer() {
  return (
    <footer className="relative bg-[#001233] overflow-hidden">
      {/* Gradiente sutil de fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#001845] via-[#001233] to-[#000814] opacity-80" />

      {/* Patrón decorativo */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand - Más ancho */}
          <div className="lg:col-span-2">
            <a href="/" className="inline-block mb-6">
              <span
                className="text-2xl font-bold tracking-tight leading-none inline-flex items-baseline bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif", fontWeight: 900 }}
              >
                <span>Finance</span>
                <span>Br</span>
                <span className="inline-flex items-center justify-center" style={{ marginLeft: '0.03em', transform: 'translateY(3px)' }}>
                  <Search className="text-white" size={20} strokeWidth={4} />
                </span>
              </span>
            </a>
            <p className="text-white/70 text-sm mb-6 max-w-sm leading-relaxed">
              Tu plataforma de comparación financiera. Encuentra los mejores
              productos financieros de forma transparente y gratuita.
            </p>

            {/* Información de contacto */}
            <div className="space-y-3 text-sm text-white/70 mb-6">
              <div className="flex items-center gap-3 hover:text-white/90 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:contacto@financebro.com">contacto@financebro.com</a>
              </div>
              <div className="flex items-center gap-3 hover:text-white/90 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Bogotá, Colombia</span>
              </div>
            </div>

            {/* Redes sociales */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-[#0466C8] flex items-center justify-center transition-all duration-300 group"
                >
                  <social.Icon className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Productos */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-base">Productos</h4>
            <ul className="space-y-3">
              {footerLinks.productos.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-base">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-base">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors inline-block hover:translate-x-1 duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom - Separador más sutil */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-white/60">
              © {new Date().getFullYear()} FinanceBro. Todos los derechos reservados.
            </p>
            <p className="text-xs text-white/40 max-w-lg text-center md:text-right">
              La información presentada es de carácter informativo. Los términos y
              condiciones finales son establecidos por cada institución financiera.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
