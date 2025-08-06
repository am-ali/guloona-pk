import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import CustomerSpotlight from "@/components/CustomerSpotlight";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedProducts />
      <CustomerSpotlight />
      <Footer />
    </div>
  );
}
