import { Header, Footer } from "@/features/shared/layout";
import { EducationComparison } from "@/features/education-credits";

const EducationCredits = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <EducationComparison />
      </main>
      <Footer />
    </div>
  );
};

export default EducationCredits;
