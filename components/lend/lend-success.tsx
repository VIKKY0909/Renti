"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Home, Plus } from "lucide-react"
import Link from "next/link"

interface LendSuccessProps {
  onBack: () => void
}

export function LendSuccess({ onBack }: LendSuccessProps) {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto animate-scale-in">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <div className="space-y-4 animate-fade-in-up">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Submitted Successfully!</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Your dress has been submitted for review. Our team will review it within 24-48 hours and notify you once it
            goes live.
          </p>
        </div>

        <div className="bg-muted/50 rounded-2xl p-6 space-y-3 text-left">
          <h3 className="font-semibold text-lg">What happens next?</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Our team will review your submission for quality and accuracy</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>You'll receive an email notification once your dress is approved</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Your dress will be live on the platform and available for rent</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>Start earning as soon as someone rents your dress</span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button size="lg" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={onBack}>
            <Plus className="h-5 w-5 mr-2" />
            List Another Dress
          </Button>
          <Link href="/" className="flex-1">
            <Button size="lg" variant="outline" className="w-full bg-transparent">
              <Home className="h-5 w-5 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Link href="/profile?tab=dresses" className="block">
          <Button variant="link" className="text-primary">
            View My Listed Dresses
          </Button>
        </Link>
      </div>
    </div>
  )
}
