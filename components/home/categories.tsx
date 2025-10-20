import Link from "next/link"
import { Badge } from "@/components/ui/badge"

const categories = [
  {
    name: "Lehenga",
    image: "/traditional-indian-lehenga.jpg",
    count: "200+ Styles",
    href: "/browse?category=lehenga",
  },
  {
    name: "Saree",
    image: "/designer-silk-saree.jpg",
    count: "180+ Styles",
    href: "/browse?category=saree",
  },
  {
    name: "Indo-Western",
    image: "/indo-western-outfit.jpg",
    count: "100+ Styles",
    href: "/browse?category=indo-western",
  },
  {
    name: "Gowns",
    image: "/elegant-designer-gown.jpg",
    count: "150+ Styles",
    href: "/browse?category=gown",
  },
]

export function Categories() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 gradient-text animate-gradient-shift">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in-slide">
            Discover your perfect outfit for every occasion
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] hover-lift animate-scale-in-spring"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <Badge className="mb-2 bg-white/20 backdrop-blur-sm text-white border-white/30 group-hover:bg-gradient-to-r group-hover:from-primary/80 group-hover:to-secondary/80 group-hover:border-transparent transition-all duration-300">
                  {category.count}
                </Badge>
                <h3 className="font-serif text-2xl font-bold group-hover:text-white transition-colors duration-300">
                  {category.name}
                </h3>
              </div>
              {/* Shimmer effect */}
              <div className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1200 ease-out" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
