"use client"

import { useState, useEffect } from "react"
import { Plus, Eye, EyeOff, Edit, Trash2, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { toast } from "sonner"

interface Banner {
  id: string
  title: string
  subtitle?: string
  description?: string
  image_url: string
  mobile_image_url?: string
  link_text?: string
  link_url?: string
  is_active: boolean
  display_order: number
  category_id?: string
  banner_categories?: {
    name: string
  }
}

export function AdminBanners() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners?admin=true')
      const data = await response.json()
      if (response.ok) {
        setBanners(data.banners || [])
      }
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (banner: Banner) => {
    try {
      const response = await fetch(`/api/banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...banner, is_active: !banner.is_active })
      })

      if (response.ok) {
        toast.success(`Banner ${!banner.is_active ? 'activated' : 'deactivated'}`)
        fetchBanners()
      }
    } catch (error) {
      console.error('Error toggling banner:', error)
    }
  }

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Banner deleted successfully')
        fetchBanners()
      }
    } catch (error) {
      console.error('Error deleting banner:', error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-bold mb-2">Banner Management</h2>
          <p className="text-muted-foreground">Manage homepage banners and promotional content</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-32 bg-muted"></div>
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold mb-2">Banner Management</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Manage homepage banners and promotional content</p>
        </div>
        <Link href="/admin/banners">
          <Button className="btn-luxury w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Manage Banners</span>
            <span className="sm:hidden">Manage</span>
          </Button>
        </Link>
      </div>

      {banners.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
            <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 text-muted-foreground mb-4" />
            <h3 className="text-base sm:text-lg font-semibold mb-2">No banners found</h3>
            <p className="text-sm sm:text-base text-muted-foreground text-center mb-4 px-4">
              Create your first banner to showcase your collections and promotions.
            </p>
            <Link href="/admin/banners">
              <Button className="btn-luxury">
                <Plus className="h-4 w-4 mr-2" />
                Create Banner
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {banners.slice(0, 6).map((banner) => (
            <Card key={banner.id} className="overflow-hidden hover-lift">
              <div className="relative h-24 sm:h-32 bg-cover bg-center" style={{ backgroundImage: `url(${banner.image_url})` }}>
                <div className="absolute top-2 right-2">
                  <Badge variant={banner.is_active ? "default" : "secondary"} className="text-xs">
                    {banner.is_active ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                    <span className="hidden sm:inline">{banner.is_active ? 'Active' : 'Inactive'}</span>
                  </Badge>
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant="outline" className="bg-white/80 text-black text-xs">
                    #{banner.sort_order}
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2 p-3 sm:p-6">
                <CardTitle className="text-sm sm:text-lg line-clamp-1">{banner.title}</CardTitle>
                {banner.subtitle && (
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{banner.subtitle}</p>
                )}
                {banner.banner_categories && (
                  <Badge variant="secondary" className="w-fit text-xs">{banner.banner_categories.name}</Badge>
                )}
              </CardHeader>
              <CardContent className="pt-0 p-3 sm:p-6">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(banner)}
                    className="flex-1 text-xs sm:text-sm"
                  >
                    {banner.is_active ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                    <span className="hidden sm:inline">{banner.is_active ? 'Hide' : 'Show'}</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="px-2 sm:px-3"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {banners.length > 6 && (
        <div className="text-center">
          <Link href="/admin/banners">
            <Button variant="outline" className="w-full sm:w-auto">
              View All Banners ({banners.length})
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}




