import Link from "next/link"
import Image from "next/image"
import { Instagram, Mail, Phone, MapPin } from "lucide-react"
import { memo } from "react"

export const Footer = memo(function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 transition-all duration-300 hover:opacity-90 animate-logo-glow">
            <span className="rounded-full bg-background/80 shadow-lg p-1 border border-border overflow-hidden flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Rentimade"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </span>
          </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your dream outfit on rent. Explore designer wear at affordable prices. Sustainable fashion made easy.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/rentimade_com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/917724023688"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="WhatsApp"
              >
                {/* WhatsApp brand icon (inline SVG) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path d="M20.52 3.48A11.94 11.94 0 0 0 12.04 0C5.44.03.1 5.37.1 11.98c0 2.11.55 4.15 1.6 5.96L0 24l6.24-1.64c1.74.95 3.71 1.45 5.73 1.45h.01c6.61 0 11.97-5.36 12.02-11.96A11.94 11.94 0 0 0 20.52 3.48Zm-8.27 18.11h-.01c-1.83 0-3.61-.49-5.17-1.42l-.37-.22-3.7.97.99-3.6-.24-.37A9.96 9.96 0 0 1 2.05 12C2.02 6.98 6.08 2.93 11.08 2.9c2.65-.02 5.15 1 7.03 2.86a9.9 9.9 0 0 1 2.94 7.06c-.04 5-4.12 9.17-9.8 9.17Z"/>
                  <path d="M17.19 13.7c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15s-.77.97-.95 1.17-.35.22-.65.08a8.06 8.06 0 0 1-2.37-1.46 8.86 8.86 0 0 1-1.64-2.03c-.17-.3 0-.46.13-.62.13-.15.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37s-1.05 1.02-1.05 2.47 1.08 2.86 1.23 3.05c.15.2 2.13 3.25 5.17 4.56.72.31 1.3.5 1.74.64.73.24 1.4.2 1.93.12.59-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/browse" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Browse
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/lend" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Lend Your Dress
                </Link>
              </li>
              <li>
                <Link href="/my-orders" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <a href="tel:+917724023688" className="hover:text-primary transition-colors">
                  +91 7724023688
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <a href="mailto:contactrentimade@gmail.com" className="hover:text-primary transition-colors">
                  contactrentimade@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Indore, Madhya Pradesh</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Rentimade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
})

