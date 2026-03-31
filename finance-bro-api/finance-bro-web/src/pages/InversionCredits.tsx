import { Header, Footer } from "@/features/shared/layout";
import { InversionComparison } from "@/features/inversion-credits";

const InversionCredits = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <InversionComparison />
      </main>
      <Footer />
    </div>
  );
};

export default InversionCredits;
