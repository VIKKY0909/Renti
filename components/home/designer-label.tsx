import { Button } from "@/components/ui/button"
import { Mail, Phone } from "lucide-react"

export function DesignerLabel() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-card rounded-3xl p-8 md:p-12 border border-border shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img src="/designer-fashion-label-clothes.jpg" alt="Designer Outfit" className="w-full h-auto rounded-2xl" />
            </div>
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">Got a designer outfit in your closet?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Your design deserves more than hanging in a cupboard. Partner with us and reach thousands of fashion
                enthusiasts.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <a href="tel:+917724023688" className="text-lg hover:text-primary transition-colors">
                    +91 7724023688
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <a href="mailto:contactrentimade@gmail.com" className="text-lg hover:text-primary transition-colors">
                    contactrentimade@gmail.com
                  </a>
                </div>
              </div>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
