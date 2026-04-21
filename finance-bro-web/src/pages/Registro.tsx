import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { authApi, ApiError } from "@/lib/api";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const registroSchema = z
  .object({
    name: z.string().min(2, "Ingresa tu nombre completo"),
    email: z.string().email("Ingresa un correo válido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(),
    terms: z
      .boolean()
      .refine((val) => val === true, "Debes aceptar los términos"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegistroValues = z.infer<typeof registroSchema>;

const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_QUINT },
  },
};

function getPasswordStrength(password: string): {
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
} {
  if (!password) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const labels = ["", "Débil", "Regular", "Buena", "Fuerte"];
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];
  return {
    level: score as 0 | 1 | 2 | 3 | 4,
    label: labels[score],
    color: colors[score],
  };
}

function LeftPanel({ reduced }: { reduced: boolean }) {
  return (
    <div
      className="hidden lg:flex lg:w-[60%] relative overflow-hidden flex-col items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, #07111E 0%, #052659 45%, #303AE4 100%)",
      }}
    >
      {/* Mesh blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, #303AE4 0%, transparent 65%)",
            filter: "blur(72px)",
            opacity: 0.55,
          }}
        />
        <div
          className="absolute -bottom-[15%] right-[5%] w-[50%] h-[50%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, #C2E8FF 0%, transparent 65%)",
            filter: "blur(80px)",
            opacity: 0.18,
          }}
        />
        <div
          className="absolute top-[30%] left-[20%] w-[45%] h-[45%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, #052659 0%, transparent 65%)",
            filter: "blur(60px)",
            opacity: 0.65,
          }}
        />
        <div
          className="absolute top-[5%] right-[20%] w-[35%] h-[40%] rounded-full"
          style={{
            background:
              "radial-gradient(circle, #FBB347 0%, transparent 65%)",
            filter: "blur(90px)",
            opacity: 0.12,
          }}
        />
      </div>

      {/* Floating geometric accents */}
      <motion.div
        animate={reduced ? {} : { y: [0, -14, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[18%] right-[12%] w-14 h-14 rounded-2xl"
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          backgroundColor: "rgba(255,255,255,0.04)",
        }}
      />
      <motion.div
        animate={reduced ? {} : { y: [0, 18, 0] }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
        }}
        className="absolute bottom-[25%] left-[8%] w-10 h-10 rounded-full"
        style={{
          border: "1px solid rgba(251,179,71,0.25)",
          backgroundColor: "rgba(251,179,71,0.06)",
        }}
      />
      <motion.div
        animate={reduced ? {} : { y: [0, -10, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
        className="absolute top-[42%] left-[10%] w-7 h-7 rounded-lg"
        style={{
          border: "1px solid rgba(255,255,255,0.10)",
          backgroundColor: "rgba(255,255,255,0.03)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-md">
        <motion.img
          src="/brand/logos/png/imagotipo-negativo.png"
          alt="FinanceBro"
          animate={reduced ? {} : { y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-full max-w-[280px] h-auto select-none mb-10"
          draggable={false}
        />

        <p className="font-sans font-light text-[rgba(194,232,255,0.70)] text-base leading-relaxed mb-10 max-w-[26ch]">
          Compara productos financieros colombianos en un solo lugar.
        </p>

        <div className="flex items-center gap-0">
          {[
            { value: "25+", label: "Bancos" },
            { value: "50K+", label: "Usuarios" },
            { value: "$5.000M+", label: "Ahorrados" },
          ].map((stat, i, arr) => (
            <div key={stat.label} className="flex items-center">
              <div className="text-center px-6">
                <p className="font-display text-3xl font-bold text-white tabular-nums leading-none">
                  {stat.value}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] mt-1.5 text-[rgba(194,232,255,0.50)]">
                  {stat.label}
                </p>
              </div>
              {i < arr.length - 1 && (
                <div className="w-px h-10 bg-white/15" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Registro() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const reduced = useReducedMotion();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegistroValues>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const watchedPassword = form.watch("password");
  const strength = getPasswordStrength(watchedPassword);

  async function onSubmit(values: RegistroValues) {
    setIsLoading(true);
    try {
      const result = await authApi.registro({
        nombre: values.name,
        email: values.email,
        password: values.password,
      });
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('user', JSON.stringify(result.user));
      toast.success(`Cuenta creada. Bienvenido, ${result.user.nombre}`);
      navigate('/');
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) {
          toast.error("Este correo ya tiene una cuenta registrada");
        } else if (err.status === 400) {
          toast.error("Por favor revisa los datos ingresados");
        } else {
          toast.error("Error al crear la cuenta. Intenta de nuevo.");
        }
      } else {
        toast.error("Error al crear la cuenta. Intenta de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      <LeftPanel reduced={!!reduced} />

      {/* Right panel */}
      <div className="flex-1 lg:w-[40%] flex flex-col min-h-screen bg-background">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center px-6 pt-6 pb-2">
          <a href="/">
            <img
              src={
                isDark
                  ? "/brand/logos/png/imagotipo-negativo.png"
                  : "/brand/logos/png/imagotipo-color.png"
              }
              alt="FinanceBro"
              className="h-7 w-auto"
            />
          </a>
        </div>

        {/* Form wrapper */}
        <div className="flex-1 flex items-center justify-center px-6 py-10 lg:px-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[400px]"
          >
            {/* Heading */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="font-display font-bold text-2xl lg:text-3xl text-foreground mb-1.5">
                Crea tu cuenta
              </h1>
              <p className="font-sans text-sm text-muted-foreground">
                Empieza a comparar créditos sin costo
              </p>
            </motion.div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Nombre */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans font-semibold text-sm text-foreground">
                          Nombre completo
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Juan García"
                            className="h-11 rounded-xl bg-muted/40 border-border"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-sans text-xs" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans font-semibold text-sm text-foreground">
                          Correo electrónico
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="tu@correo.com"
                            className="h-11 rounded-xl bg-muted/40 border-border"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="font-sans text-xs" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Password + strength */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans font-semibold text-sm text-foreground">
                          Contraseña
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-11 rounded-xl bg-muted/40 border-border pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label={
                                showPassword
                                  ? "Ocultar contraseña"
                                  : "Mostrar contraseña"
                              }
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        {/* Strength bar */}
                        {watchedPassword && (
                          <div className="mt-2">
                            <div className="flex gap-1 mb-1">
                              {[1, 2, 3, 4].map((seg) => (
                                <div
                                  key={seg}
                                  className="h-1 flex-1 rounded-full transition-all duration-300"
                                  style={{
                                    backgroundColor:
                                      seg <= strength.level
                                        ? strength.color
                                        : "hsl(var(--border))",
                                  }}
                                />
                              ))}
                            </div>
                            {strength.label && (
                              <p
                                className="text-xs font-sans font-medium"
                                style={{ color: strength.color }}
                              >
                                {strength.label}
                              </p>
                            )}
                          </div>
                        )}
                        <FormMessage className="font-sans text-xs" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Confirm password */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-sans font-semibold text-sm text-foreground">
                          Confirmar contraseña
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirm ? "text" : "password"}
                              placeholder="••••••••"
                              className="h-11 rounded-xl bg-muted/40 border-border pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirm((v) => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                              aria-label={
                                showConfirm
                                  ? "Ocultar contraseña"
                                  : "Mostrar contraseña"
                              }
                            >
                              {showConfirm ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="font-sans text-xs" />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Terms */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-2.5 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <p className="text-sm font-sans leading-snug text-foreground">
                            Acepto los{" "}
                            <span className="font-semibold text-primary cursor-pointer hover:underline">
                              Términos de uso
                            </span>{" "}
                            y la{" "}
                            <span className="font-semibold text-primary cursor-pointer hover:underline">
                              Política de privacidad
                            </span>
                          </p>
                          <FormMessage className="font-sans text-xs" />
                        </div>
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Submit */}
                <motion.div variants={itemVariants}>
                  <motion.div
                    whileTap={reduced ? {} : { scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-11 rounded-xl font-sans font-semibold text-sm bg-brand-electric hover:bg-brand-electric/90 text-white transition-all duration-200 shadow-md shadow-brand-electric/20"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Creando cuenta...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4" />
                          Crear cuenta
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Divider */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <Separator className="flex-1" />
                  <span className="text-xs text-muted-foreground font-sans whitespace-nowrap">
                    o continúa con
                  </span>
                  <Separator className="flex-1" />
                </motion.div>

                {/* Google button */}
                <motion.div variants={itemVariants}>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 rounded-xl font-sans font-medium text-sm border-border hover:bg-muted/50 transition-colors gap-3"
                    onClick={() =>
                      toast.info(
                        "Próximamente disponible — estamos construyendo esto"
                      )
                    }
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continuar con Google
                  </Button>
                </motion.div>
              </form>
            </Form>

            {/* Footer */}
            <motion.p
              variants={itemVariants}
              className="mt-7 text-center text-sm text-muted-foreground font-sans"
            >
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Inicia sesión
              </button>{" "}
              &rarr;
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
