"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Eye, Loader2, Shirt, Trash2 } from "lucide-react"
import Link from "next/link"
import { getUserProducts, deleteProduct } from "@/lib/actions/products"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"
import { formatDate } from "@/lib/utils"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

interface Dress {
  id: string
  title: string
  images: string[]
  rental_price: number
  status: string
  total_rentals: number
  created_at: string
}

export function MyDresses() {
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDresses() {
      try {
        const { products: data, error } = await getUserProducts()
        if (error) {
          console.error("Error fetching dresses:", error)
        } else {
          setDresses(data || [])
        }
      } catch (error) {
        console.error("Error fetching dresses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDresses()
  }, [])

  const handleDelete = async (dressId: string) => {
    setDeleting(dressId)
    try {
      const { success, error } = await deleteProduct(dressId)
      if (success) {
        setDresses(dresses.filter(dress => dress.id !== dressId))
      } else {
        alert(error || "Failed to delete dress")
      }
    } catch (error) {
      console.error("Error deleting dress:", error)
      alert("Failed to delete dress")
    } finally {
      setDeleting(null)
    }
  }
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold mb-2">My Dresses</h2>
            <p className="text-muted-foreground">Manage your listed dresses for rent</p>
          </div>
          <Link href="/lend">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              List New Dress
            </Button>
          </Link>
        </div>
        <SkeletonLoader type="grid" count={4} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-bold mb-2">My Dresses</h2>
          <p className="text-muted-foreground">Manage your listed dresses for rent</p>
        </div>
        <Link href="/lend">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            List New Dress
          </Button>
        </Link>
      </div>

      {dresses.length === 0 ? (
        <div className="text-center py-20">
          <Shirt className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-xl mb-2">No dresses listed yet</h3>
          <p className="text-muted-foreground mb-6">Start earning by listing your designer dresses for rent</p>
          <Link href="/lend">
            <Button>List Your First Dress</Button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {dresses.map((dress) => (
            <div key={dress.id} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="relative aspect-[4/3]">
                <img 
                  src={dress.images?.[0] || "/placeholder.svg"} 
                  alt={dress.title} 
                  className="w-full h-full object-cover" 
                />
                <Badge
                  className={`absolute top-4 right-4 ${
                    dress.status === "approved" ? "bg-green-500" : 
                    dress.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                  } text-white`}
                >
                  {dress.status === "approved" ? "Available" : 
                   dress.status === "pending" ? "Pending Review" : "Rejected"}
                </Badge>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-xl mb-2">{dress.title}</h3>
                  <p className="text-2xl font-bold">₹{dress.rental_price}/rental</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Rentals</p>
                    <p className="font-semibold text-lg">{dress.total_rentals}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-semibold text-lg capitalize">{dress.status}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/lend/edit/${dress.id}`} className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full bg-transparent"
                      disabled={deleting === dress.id}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <Link href={`/products/${dress.id}`} className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent" disabled={deleting === dress.id}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={deleting === dress.id}
                      >
                        {deleting === dress.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Dress</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{dress.title}"? This action cannot be undone.
                          You can only delete dresses that have never been rented.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(dress.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
