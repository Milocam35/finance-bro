import { Header, Footer } from "@/features/shared/layout";
import { VehicleComparison } from "@/features/vehicle-credits";

const VehicleCredits = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <VehicleComparison />
      </main>
      <Footer />
    </div>
  );
};

export default VehicleCredits;
