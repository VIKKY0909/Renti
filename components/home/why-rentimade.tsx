import { Truck, Shield, RotateCcw, Award } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Doorstep Delivery",
    description: "Fast and reliable delivery to your doorstep across India",
  },
  {
    icon: Shield,
    title: "Quality Check",
    description: "Every outfit is quality checked and dry-cleaned before delivery",
  },
  {
    icon: RotateCcw,
    title: "Hassle-free Returns",
    description: "Easy returns with free pickup from your location",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Authentic designer wear from top brands and labels",
  },
]

export function WhyRentimade() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Why Choose Rentimade?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience premium fashion rental with unmatched quality and service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
