"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Heart, ShoppingCart, User, Menu, X, LogOut, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, memo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { AdminBanner } from "@/components/ui/admin-banner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Header = memo(function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { user, profile, signOut } = useAuth()
  const { items } = useCart()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <>
      <AdminBanner />
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-all duration-300 hover:opacity-90 animate-logo-glow">
            <span className="rounded-full bg-background/80 shadow-lg p-1 border border-border overflow-hidden flex items-center justify-center">
              <Image
                src="logo.png"
                alt="Rentimade"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" prefetch={true} className="text-sm font-medium hover:text-primary transition-all duration-200 flex items-center gap-1 hover-lift">
              <Home className="h-4 w-4 icon-bounce" />
              Home
            </Link>
            <Link href="/browse" prefetch={true} className="text-sm font-medium hover:text-primary transition-all duration-200 hover-lift">
              Browse
            </Link>
            <Link href="/categories" prefetch={true} className="text-sm font-medium hover:text-primary transition-all duration-200 hover-lift">
              Categories
            </Link>
            <Link href="/about" prefetch={true} className="text-sm font-medium hover:text-primary transition-all duration-200 hover-lift">
              About Us
            </Link>
            <Link href="/contact" prefetch={true} className="text-sm font-medium hover:text-primary transition-all duration-200 hover-lift">
              Contact
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)} className="hover:bg-muted icon-bounce">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="hover:bg-muted relative icon-bounce">
                <Heart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-secondary text-[10px] font-bold flex items-center justify-center">
                  {items.length}
                </span>
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="hover:bg-muted relative icon-bounce">
                <ShoppingCart className="h-5 w-5" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="inline-flex items-center justify-center rounded-md h-10 w-10 hover:bg-muted relative transition-colors"
                    aria-label="User menu"
                    type="button"
                  >
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 z-[9999] bg-popover text-popover-foreground shadow-md border" sideOffset={8}>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer w-full">
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile/orders" className="cursor-pointer w-full">
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/manage-listings" className="cursor-pointer w-full">
                      Manage Listings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer w-full">
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {profile?.is_admin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer font-medium text-primary w-full">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon" className="hover:bg-muted">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            <Link href="/lend">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                Lend Your Dress
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search for sarees, lehengas, gowns..." 
                className="pl-10 w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-fade-in">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search..." 
                className="pl-10 w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
            <Link href="/" className="block py-2 text-sm font-medium hover:text-primary transition-all duration-200 flex items-center gap-2 hover-lift">
              <Home className="h-4 w-4 icon-bounce" />
              Home
            </Link>
            <Link href="/browse" className="block py-2 text-sm font-medium hover:text-primary transition-all duration-200 hover-lift">
              Browse
            </Link>
            <Link href="/categories" className="block py-2 text-sm font-medium hover:text-primary transition-all duration-200 hover-lift">
              Categories
            </Link>
            <Link href="/about" className="block py-2 text-sm font-medium hover:text-primary transition-all duration-200 hover-lift">
              About Us
            </Link>
            <Link href="/contact" className="block py-2 text-sm font-medium hover:text-primary transition-all duration-200 hover-lift">
              Contact
            </Link>
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <Link href="/wishlist" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  <Heart className="h-4 w-4 mr-2" />
                  Wishlist
                </Button>
              </Link>
              <Link href="/cart" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                </Button>
              </Link>
            </div>
            {user ? (
              <Link href="/profile">
                <Button variant="outline" className="w-full bg-transparent justify-start" aria-label="Go to profile">
                  <User className="h-4 w-4 mr-2" />
                  My Profile
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" className="w-full bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
            <Link href="/lend" className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Lend Your Dress</Button>
            </Link>
          </div>
        )}
      </div>
      </header>
    </>
  )
})
