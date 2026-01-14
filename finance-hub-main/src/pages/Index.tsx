import { Header, Footer } from "@/features/shared/layout";
import { Hero, Features, CategoriesPreview } from "@/features/shared/common";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Features />
        <CategoriesPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
