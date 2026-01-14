import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Search, CreditCard, Shield, TrendingUp, Building2, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Créditos",
    icon: Building2,
    submenu: [
      { label: "Créditos Hipotecarios", href: "/creditos-hipotecarios", active: true },
      { label: "Créditos Personales", href: "#personales", comingSoon: true },
      { label: "Créditos Automotriz", href: "#automotriz", comingSoon: true },
      { label: "Créditos Empresariales", href: "#empresariales", comingSoon: true },
    ],
  },
  {
    label: "Seguros",
    icon: Shield,
    href: "#seguros",
    comingSoon: true,
  },
  {
    label: "Tarjetas",
    icon: CreditCard,
    href: "#tarjetas",
    comingSoon: true,
  },
  {
    label: "Inversiones",
    icon: TrendingUp,
    href: "#inversiones",
    comingSoon: true,
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-0">
            <span className="text-2xl font-bold tracking-tight leading-none inline-flex items-baseline" style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 900 }}>
              <span className="text-foreground">Finance</span>
              <span className="text-[#0466C8]">Br</span>
              <span className="inline-flex items-center justify-center" style={{ marginLeft: '0.03em', transform: 'translateY(3px)' }}>
                <Search className="text-[#0466C8]" size={20} strokeWidth={4} />
              </span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.submenu && setOpenSubmenu(item.label)}
                onMouseLeave={() => setOpenSubmenu(null)}
              >
                <button
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.submenu && <ChevronDown className="w-3 h-3" />}
                  {item.comingSoon && (
                    <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[#FFD60A] text-[#001233] font-semibold">
                      Pronto
                    </span>
                  )}
                </button>

                {/* Submenu */}
                <AnimatePresence>
                  {item.submenu && openSubmenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-1 w-56 bg-card rounded-lg shadow-lg border border-border overflow-hidden"
                    >
                      {item.submenu.map((subitem) => (
                        <a
                          key={subitem.label}
                          href={subitem.href}
                          className={`flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors ${
                            subitem.active
                              ? "text-primary font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {subitem.label}
                          {subitem.comingSoon && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground font-semibold">
                              Pronto
                            </span>
                          )}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="px-5 py-2 font-medium"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>
            <Button
              size="sm"
              className="px-6 py-2 font-semibold bg-[#0466C8] hover:bg-[#0353A4] text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Registrarse
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() =>
                      setOpenSubmenu(
                        openSubmenu === item.label ? null : item.label
                      )
                    }
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-foreground rounded-lg hover:bg-muted"
                  >
                    <span className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </span>
                    {item.submenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openSubmenu === item.label ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {item.submenu && openSubmenu === item.label && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subitem) => (
                        <a
                          key={subitem.label}
                          href={subitem.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                          {subitem.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-border flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 font-medium"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Iniciar Sesión
                </Button>
                <Button className="flex-1 font-semibold bg-blue-600 hover:bg-blue-700 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrarse
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
