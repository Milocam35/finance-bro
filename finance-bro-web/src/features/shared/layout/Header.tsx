import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogIn, UserPlus, Sun, Moon, LogOut, User } from "lucide-react";
import { useTheme } from "@/components/theme-provider";

const navItems = [
  {
    label: "Créditos",
    href: "/creditos",
    submenu: [
      { label: "Créditos Hipotecarios", href: "/creditos-hipotecarios", active: true },
      { label: "Créditos de Vehículo", href: "/creditos-vehiculo", active: true },
      { label: "Créditos Educativos", href: "/creditos-educativos", active: true },
      { label: "Créditos de Libre Inversión", href: "/creditos-libre-inversion", active: true },
      { label: "Crédito Corporativo", href: "#corporativo", comingSoon: true },
    ],
  },
  { label: "Inversiones", href: "#inversiones", comingSoon: true },
  { label: "Tarjetas",    href: "#tarjetas",    comingSoon: true },
  { label: "Seguros",     href: "#seguros",     comingSoon: true },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Header() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Auth state derived from localStorage
  const [authUser, setAuthUser] = useState<{ nombre: string; email: string } | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Sync auth state if localStorage changes in another tab
  useEffect(() => {
    const onStorage = () => {
      try {
        const raw = localStorage.getItem("user");
        setAuthUser(raw ? JSON.parse(raw) : null);
      } catch {
        setAuthUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isDark = theme === "dark";

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", controlHeader);
    return () => window.removeEventListener("scroll", controlHeader);
  }, [lastScrollY]);

  function handleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setAuthUser(null);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  }

  const headerBg     = isDark
    ? "bg-gradient-to-b from-black/60 via-black/40 to-transparent"
    : "bg-white/95 backdrop-blur-md border-b border-border shadow-sm";
  const navText      = isDark ? "text-gray-300 hover:text-white" : "text-muted-foreground hover:text-foreground";
  const navHoverBg   = isDark ? "hover:bg-white/10" : "hover:bg-muted";
  const iconColor    = isDark ? "text-white/70" : "text-muted-foreground";
  const mobileIconColor  = isDark ? "text-white" : "text-foreground";
  const mobileBg         = isDark ? "bg-[#001845] border-t border-white/10" : "bg-white border-t border-border";
  const mobileItemText   = isDark ? "text-white" : "text-foreground";
  const mobileSubtext    = isDark ? "text-gray-300" : "text-muted-foreground";
  const mobileSubBg      = isDark ? "bg-black/20" : "bg-muted/50";
  const mobileDivider    = isDark ? "border-white/10" : "border-border";
  const mobileBtnBorder  = isDark ? "border-white/20" : "border-border";

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
    >
      <div className="container mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">

          {/* Logo */}
          <a href="/" className="flex items-center shrink-0">
            <img
              src={isDark ? "/brand/logos/png/imagotipo-negativo.png" : "/brand/logos/png/imagotipo-color.png"}
              alt="FinanceBro"
              className="h-6 lg:h-7 w-auto select-none"
              draggable={false}
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.submenu && setOpenSubmenu(item.label)}
                onMouseLeave={() => setOpenSubmenu(null)}
              >
                <button
                  className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${navText} ${navHoverBg}`}
                  onClick={() => item.href && navigate(item.href)}
                >
                  {item.label}
                  {item.submenu && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                  {item.comingSoon && (
                    <span className="ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-brand-sunset/15 text-brand-sunset font-semibold">
                      Pronto
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {item.submenu && openSubmenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 mt-2 w-60 bg-card rounded-xl shadow-xl border border-border overflow-hidden"
                    >
                      {item.submenu.map((subitem) => (
                        <a
                          key={subitem.label}
                          href={subitem.href}
                          className={`flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors ${
                            subitem.active ? "text-primary font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {subitem.label}
                          {subitem.comingSoon && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-sunset/15 text-brand-sunset font-semibold">
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

          {/* Right: Beta + Theme + Auth */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-sunset/12 text-brand-sunset border border-brand-sunset/25 tracking-wide">
              Beta
            </span>
            <button
              onClick={toggleTheme}
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${iconColor} ${navHoverBg}`}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {authUser ? (
              /* ── Authenticated: avatar + dropdown ── */
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl transition-colors hover:bg-muted/60"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-electric flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-white leading-none">
                      {getInitials(authUser.nombre)}
                    </span>
                  </div>
                  <span className={`text-sm font-medium max-w-[96px] truncate ${isDark ? "text-white" : "text-foreground"}`}>
                    {authUser.nombre.split(" ")[0]}
                  </span>
                  <ChevronDown className={`w-3 h-3 opacity-50 transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""} ${isDark ? "text-white" : "text-foreground"}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.16 }}
                      className="absolute top-full right-0 mt-2 w-56 bg-card rounded-xl shadow-xl border border-border overflow-hidden"
                    >
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-electric flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-white leading-none">
                              {getInitials(authUser.nombre)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{authUser.nombre}</p>
                            <p className="text-xs text-muted-foreground truncate">{authUser.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-1.5">
                        <button
                          onClick={() => { setUserMenuOpen(false); navigate("/perfil"); }}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4 text-muted-foreground" />
                          Mi perfil
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/8 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* ── Guest: login + register buttons ── */
              <>
                <button
                  onClick={() => navigate('/login')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${navText} ${navHoverBg}`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Iniciar sesión
                </button>
                <button
                  onClick={() => navigate('/registro')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-brand-dark bg-brand-sunset hover:bg-brand-sunset/90 rounded-lg transition-all duration-200 shadow-sm shadow-brand-sunset/20 dark:shadow-none"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Registrarse
                </button>
              </>
            )}
          </div>

          {/* Mobile: Beta badge + menu button */}
          <div className="lg:hidden flex items-center gap-3">
            {authUser && (
              <div className="w-7 h-7 rounded-full bg-brand-electric flex items-center justify-center">
                <span className="text-[11px] font-bold text-white leading-none">
                  {getInitials(authUser.nombre)}
                </span>
              </div>
            )}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-sunset/12 text-brand-sunset border border-brand-sunset/25">
              Beta
            </span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${navHoverBg}`}
              aria-label="Menú"
            >
              {mobileMenuOpen
                ? <X className={`w-5 h-5 ${mobileIconColor}`} />
                : <Menu className={`w-5 h-5 ${mobileIconColor}`} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`lg:hidden overflow-hidden ${mobileBg}`}
          >
            <div className="container mx-auto px-5 py-5 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => {
                      if (item.href && !item.submenu) navigate(item.href);
                      setOpenSubmenu(openSubmenu === item.label ? null : item.label);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-colors ${mobileItemText} ${navHoverBg}`}
                  >
                    <span>{item.label}</span>
                    <div className="flex items-center gap-2">
                      {item.comingSoon && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-sunset/12 text-brand-sunset font-semibold">
                          Pronto
                        </span>
                      )}
                      {item.submenu && (
                        <ChevronDown className={`w-4 h-4 opacity-50 transition-transform duration-200 ${openSubmenu === item.label ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {item.submenu && openSubmenu === item.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className={`mx-2 mb-1 rounded-xl p-2 ${mobileSubBg}`}>
                          {item.submenu.map((subitem) => (
                            <a
                              key={subitem.label}
                              href={subitem.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-colors ${mobileSubtext} ${navHoverBg}`}
                            >
                              <span>{subitem.label}</span>
                              {subitem.comingSoon && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-sunset/12 text-brand-sunset font-semibold">
                                  Pronto
                                </span>
                              )}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Bottom actions */}
              <div className={`pt-4 mt-3 border-t flex flex-col gap-2.5 ${mobileDivider}`}>
                <button
                  onClick={toggleTheme}
                  className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl border transition-colors ${mobileItemText} ${mobileBtnBorder} ${navHoverBg}`}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? "Modo claro" : "Modo oscuro"}
                </button>

                {authUser ? (
                  /* ── Mobile authenticated ── */
                  <>
                    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${mobileBtnBorder}`}>
                      <div className="w-8 h-8 rounded-full bg-brand-electric flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-white leading-none">
                          {getInitials(authUser.nombre)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${mobileItemText}`}>{authUser.nombre}</p>
                        <p className={`text-xs truncate ${mobileSubtext}`}>{authUser.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500/8 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  /* ── Mobile guest ── */
                  <>
                    <button
                      onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                      className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl border transition-colors ${mobileItemText} ${mobileBtnBorder} ${navHoverBg}`}
                    >
                      <LogIn className="w-4 h-4" />
                      Iniciar sesión
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); navigate('/registro'); }}
                      className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-brand-dark bg-brand-sunset hover:bg-brand-sunset/90 rounded-xl transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Registrarse
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
