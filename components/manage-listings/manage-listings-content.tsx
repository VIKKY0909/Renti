"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, MoreVertical, Trash2, Eye, TrendingUp, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Listing {
  id: string
  title: string
  images: string[]
  rental_price: number
  status: string
  is_available: boolean
  views: number
  total_rentals: number
  average_rating: number
  created_at: string
}

interface ManageListingsContentProps {
  listings: Listing[]
  userId: string
}

export function ManageListingsContent({ listings: initialListings, userId }: ManageListingsContentProps) {
  const [listings, setListings] = useState(initialListings)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!selectedListing) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from("products").delete().eq("id", selectedListing).eq("owner_id", userId)

      if (error) throw error

      setListings(listings.filter((listing) => listing.id !== selectedListing))
      toast({
        title: "Listing deleted",
        description: "Your listing has been successfully deleted.",
      })
      setDeleteDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("[v0] Error deleting listing:", error)
      toast({
        title: "Error",
        description: "Failed to delete listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setSelectedListing(null)
    }
  }

  const handleToggleAvailability = async (listingId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_available: !currentStatus })
        .eq("id", listingId)
        .eq("owner_id", userId)

      if (error) throw error

      setListings(
        listings.map((listing) => (listing.id === listingId ? { ...listing, is_available: !currentStatus } : listing)),
      )

      toast({
        title: currentStatus ? "Listing hidden" : "Listing published",
        description: currentStatus
          ? "Your listing is now hidden from renters."
          : "Your listing is now visible to renters.",
      })
      router.refresh()
    } catch (error) {
      console.error("[v0] Error updating listing:", error)
      toast({
        title: "Error",
        description: "Failed to update listing. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string, isAvailable: boolean) => {
    if (!isAvailable) {
      return <Badge variant="secondary">Hidden</Badge>
    }
    switch (status) {
      case "active":
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "rented":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Rented</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold mb-2">Manage Your Listings</h1>
        <p className="text-muted-foreground">View and manage all your rental listings in one place</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <div className="text-sm">
            <span className="font-medium">{listings.length}</span> Total Listings
          </div>
          <div className="text-sm">
            <span className="font-medium">{listings.filter((l) => l.is_available).length}</span> Active
          </div>
          <div className="text-sm">
            <span className="font-medium">{listings.filter((l) => !l.is_available).length}</span> Hidden
          </div>
        </div>
        <Link href="/lend">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Package className="h-4 w-4 mr-2" />
            Add New Listing
          </Button>
        </Link>
      </div>

      {listings.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <Package className="h-16 w-16 text-muted-foreground" />
            <div>
              <h3 className="font-serif text-2xl font-bold mb-2">No listings yet</h3>
              <p className="text-muted-foreground mb-6">Start earning by listing your first item</p>
              <Link href="/lend">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Create Your First Listing
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="relative aspect-[3/4] bg-muted">
                  {listing.images && listing.images.length > 0 ? (
                    <Image
                      src={listing.images[0] || "/placeholder.svg"}
                      alt={listing.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">{getStatusBadge(listing.status, listing.is_available)}</div>
                  <div className="absolute top-3 right-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${listing.id}`} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" />
                            View Listing
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/lend/edit/${listing.id}`} className="cursor-pointer">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleAvailability(listing.id, listing.is_available)}
                          className="cursor-pointer"
                        >
                          {listing.is_available ? "Hide Listing" : "Publish Listing"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedListing(listing.id)
                            setDeleteDialogOpen(true)
                          }}
                          className="cursor-pointer text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{listing.title}</h3>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold">₹{listing.rental_price}</span>
                    <span className="text-sm text-muted-foreground">/day</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{listing.views || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>{listing.total_rentals || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{listing.average_rating?.toFixed(1) || "0.0"}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex gap-2">
                <Link href={`/lend/edit/${listing.id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/products/${listing.id}`} className="flex-1">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your listing and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
