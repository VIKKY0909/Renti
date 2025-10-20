"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

const stories = [
  {
    name: "Reena Neema",
    location: "Indore",
    image: "/reema.jpeg",
    story: "The lehenga I rented Is so stunning and delivery process is so smooth no extra chaos needed",
    rating: 5,
    outfit: "Designer Lehenga",
  },
  {
    name: "Ruchi Sharma",
    location: "Khandwa",
    image: "/ruchi.jpeg",
    story: "This saree is perfect for my mehendi. Rentimade is so good , highly recommended.",
    rating: 5,
    outfit: "Silk Saree",
  },
  {
    name: "Sapna Mahajan",
    location: "Khargone",
    image: "/sapna.jpg",
    story: "This saree is perfect for my mehendi. Rentimade is so good , highly recommended.",
    rating: 5,
    outfit: "Designer Lehenga",
  }
]

export function CustomerStories() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Customer Stories</h2>
          <p className="text-lg text-muted-foreground">Hear from our happy customers</p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          <div className="bg-card rounded-3xl p-8 md:p-12 border border-border shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <img
                  src={stories[currentIndex].image || "/placeholder.svg"}
                  alt={stories[currentIndex].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div className="flex gap-1">
                  {Array.from({ length: stories[currentIndex].rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed italic">"{stories[currentIndex].story}"</p>
                <div>
                  <p className="font-semibold text-lg">{stories[currentIndex].name}</p>
                  <p className="text-sm text-muted-foreground">{stories[currentIndex].location}</p>
                  <p className="text-sm text-primary mt-1">{stories[currentIndex].outfit}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full bg-transparent">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="rounded-full bg-transparent">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
