import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { AutoSliderBanner } from "@/components/home/auto-slider-banner"
import { DiscountBanner } from "@/components/home/discount-banner"
import { WhyRentimade } from "@/components/home/why-rentimade"
import { Categories } from "@/components/home/categories"
import { DesignerLabel } from "@/components/home/designer-label"
import { FashionEmergency } from "@/components/home/fashion-emergency"
import { CustomerStories } from "@/components/home/customer-stories"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col page-transition">
      <Header />
      {/* <DiscountBanner /> */}
      <main className="flex-1">
        <AutoSliderBanner />
        <div className="animate-fade-in-up">
          <HeroSection />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <WhyRentimade />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Categories />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <DesignerLabel />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <FashionEmergency />
        </div>
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <CustomerStories />
        </div>
      </main>
      <Footer />
    </div>
  )
}
