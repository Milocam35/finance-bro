import { Header, Footer } from "@/features/shared/layout";
import { Hero, Features, CategoriesPreview } from "@/features/shared/common";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fondo base con gradiente complejo */}
      <div className="fixed inset-0 bg-gradient-to-br from-background via-muted/20 to-background -z-10" />

      {/* Mesh gradient overlay */}
      <div
        className="fixed inset-0 opacity-25 -z-10"
        style={{
          backgroundImage: `
            radial-gradient(at 15% 20%, rgba(4, 102, 200, 0.12) 0px, transparent 50%),
            radial-gradient(at 85% 15%, rgba(4, 102, 200, 0.08) 0px, transparent 50%),
            radial-gradient(at 30% 70%, rgba(4, 102, 200, 0.10) 0px, transparent 50%),
            radial-gradient(at 75% 85%, rgba(4, 102, 200, 0.09) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(4, 102, 200, 0.06) 0px, transparent 50%)
          `
        }}
      />

      {/* Patrón de puntos */}
      <div
        className="fixed inset-0 opacity-[0.08] -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(4, 102, 200, 0.25) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Orbes grandes animados */}
      <motion.div
        className="fixed -top-32 -left-32 w-[700px] h-[700px] bg-[#0466C8]/6 rounded-full blur-[120px] -z-10"
        animate={{
          x: [0, 200, 0],
          y: [0, 150, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed -bottom-32 -right-32 w-[600px] h-[600px] bg-[#0466C8]/8 rounded-full blur-[120px] -z-10"
        animate={{
          x: [0, -150, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="fixed top-1/2 left-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10"
        animate={{
          x: [-100, 100, -100],
          y: [-80, 80, -80],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Partículas flotantes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed w-1.5 h-1.5 bg-[#0466C8]/15 rounded-full -z-10"
          style={{
            left: `${(i * 12 + 5) % 95}%`,
            top: `${(i * 18 + 10) % 90}%`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, (i % 3 === 0 ? 30 : i % 3 === 1 ? -30 : 15), 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}

      {/* Grid sutil */}
      <div
        className="fixed inset-0 opacity-[0.03] -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(4, 102, 200, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(4, 102, 200, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Overlay final para suavizar */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/30 -z-10" />

      {/* Contenido de la página */}
      <div className="relative">
        <Header />
        <main>
          <Hero />
          <Features />
          <CategoriesPreview />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
