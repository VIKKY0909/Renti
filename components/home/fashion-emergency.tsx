import { Button } from "@/components/ui/button"
import { Clock, Phone } from "lucide-react"

export function FashionEmergency() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-accent/20 to-primary/20 rounded-3xl p-8 md:p-12 border border-border">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium">
                <Clock className="h-4 w-4" />
                <span>Last Minute Orders</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Closet Crisis?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Too late to place your order for the event? Don't worry! Call us and we'll do our best to rescue you.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-accent" />
                  <a href="tel:+917724023688" className="text-lg font-semibold hover:text-accent transition-colors">
                    +91 7724023688
                  </a>
                </div>
              </div>
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Call Now
              </Button>
            </div>
            <div>
              <img src="/urgent-fashion-emergency-designer-dress.jpg" alt="Closet Crisis" className="w-full h-auto rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
