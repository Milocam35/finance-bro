import { Header, Footer } from "@/features/shared/layout";
import { BankComparison } from "@/features/mortgage-loans";

const MortgageLoans = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <BankComparison />
      </main>
      <Footer />
    </div>
  );
};

export default MortgageLoans;
