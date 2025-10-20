import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/10 to-background min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          {/* Promotional Badge */}
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-secondary/20 via-primary/20 to-accent/20 text-foreground text-sm font-medium animate-bounce-in border border-primary/20 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 animate-float" />
            <span className="font-semibold">Start your journey with us</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
            <span className="animate-text-reveal inline-block">Why repeat when</span>
            <br />
            <span className="gradient-text animate-gradient-shift animate-text-reveal inline-block" style={{ animationDelay: '0.3s' }}>
              you can rent?
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
            With Rentimade, explore a wide range of designer outfits at affordable prices. Sustainable fashion made easy.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <Link href="/browse">
              <Button size="lg" className="btn-luxury text-lg px-10 py-6 hover-glow animate-scale-in-spring font-semibold" style={{ animationDelay: '0.9s' }}>
                Start Browsing
              </Button>
            </Link>
            <Link href="/lend">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 bg-transparent hover-lift border-2 border-primary/30 hover:border-primary/60 animate-scale-in-spring font-semibold" style={{ animationDelay: '1.1s' }}>
                Lend Your Dress
              </Button>
            </Link>
          </div>

          {/* Stats */}
          {/* <div className="grid grid-cols-3 gap-8 pt-16 animate-fade-in-up" style={{ animationDelay: '1.3s' }}>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">500+</div>
              <div className="text-sm text-muted-foreground">Designer Outfits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text">50+</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Enhanced Floating Elements */}
      <div className="absolute top-20 left-10 w-80 h-80 bg-gradient-to-br from-secondary/20 to-primary/15 rounded-full blur-3xl -z-10 animate-float-slow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/15 rounded-full blur-3xl -z-10 animate-float-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-accent/15 to-secondary/10 rounded-full blur-2xl -z-10 animate-float-slow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-gradient-to-br from-primary/25 to-accent/20 rounded-full blur-xl -z-10 animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Parallax Elements */}
      <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-gradient-to-br from-secondary/30 to-primary/20 rounded-full blur-lg -z-10 animate-float" style={{ animationDelay: '2.5s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-gradient-to-br from-accent/25 to-secondary/15 rounded-full blur-lg -z-10 animate-float-slow" style={{ animationDelay: '3s' }} />
    </section>
  )
}
