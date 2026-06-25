import { lazy, Suspense } from "react";
import { Header, Footer } from "@/features/shared/layout";
import { Hero } from "@/features/shared/common";

const Features = lazy(() =>
  import("@/features/shared/common/Features").then((m) => ({ default: m.Features }))
);
const CategoriesPreview = lazy(() =>
  import("@/features/shared/common/CategoriesPreview").then((m) => ({ default: m.CategoriesPreview }))
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Features />
        </Suspense>
        <Suspense fallback={null}>
          <CategoriesPreview />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
