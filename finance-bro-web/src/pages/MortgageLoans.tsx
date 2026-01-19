import { Header, Footer } from "@/features/shared/layout";
import { BankComparison } from "@/features/mortgage-loans";

const MortgageLoans = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <BankComparison />
      </main>
      <Footer />
    </div>
  );
};

export default MortgageLoans;
