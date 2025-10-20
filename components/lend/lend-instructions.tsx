"use client"

import { Button } from "@/components/ui/button"
import { Plus, CheckCircle, Camera, DollarSign, Shield, Clock } from "lucide-react"

const instructions = [
  {
    icon: Camera,
    title: "Take Quality Photos",
    description: "Upload clear, well-lit photos of your dress from multiple angles. Good photos attract more renters.",
  },
  {
    icon: Shield,
    title: "Provide Accurate Details",
    description: "Include accurate measurements, fabric details, and condition. Transparency builds trust.",
  },
  {
    icon: DollarSign,
    title: "Set Competitive Pricing",
    description: "Research similar items and set a fair rental price. We'll help you maximize your earnings.",
  },
  {
    icon: Clock,
    title: "Quick Review Process",
    description: "Our team reviews submissions within 24-48 hours. You'll be notified once your dress goes live.",
  },
]

const benefits = [
  "Earn money from dresses sitting in your closet",
  "Help others access designer wear affordably",
  "Contribute to sustainable fashion",
  "Full insurance coverage on all rentals",
  "Hassle-free pickup and delivery",
  "Secure and timely payments",
]

interface LendInstructionsProps {
  onOpenForm: () => void
}

export function LendInstructions({ onOpenForm }: LendInstructionsProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Lend Your Designer Dress</h1>
        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
          Turn your wardrobe into a source of income. List your designer outfits and start earning today.
        </p>
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
          onClick={onOpenForm}
        >
          <Plus className="h-5 w-5 mr-2" />
          List Your Dress
        </Button>
      </div>

      {/* How It Works */}
      <div className="mb-16">
        <h2 className="font-serif text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructions.map((instruction, index) => (
            <div
              key={index}
              className="text-center space-y-4 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <instruction.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{instruction.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{instruction.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 mb-16">
        <h2 className="font-serif text-3xl font-bold text-center mb-8">Why Lend With Rentimade?</h2>
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-muted-foreground">{benefit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="font-serif text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-8">List your first dress and start earning in minutes</p>
        <Button
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
          onClick={onOpenForm}
        >
          <Plus className="h-5 w-5 mr-2" />
          List Your Dress Now
        </Button>
      </div>
    </div>
  )
}
