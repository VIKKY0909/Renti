"use client"

import { useState, useEffect } from "react"
import { X, Edit, Save, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

interface BannerData {
  id: string
  text: string
  link?: string
  backgroundColor: string
  textColor: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export function AdminBanner() {
  const { user, profile } = useAuth()
  const [banner, setBanner] = useState<BannerData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [editForm, setEditForm] = useState({
    text: "",
    link: "",
    backgroundColor: "#3b82f6",
    textColor: "#ffffff"
  })

  // Check if user is admin
  const isAdmin = profile?.is_admin

  // Fetch banner data (mock for now - replace with actual API call)
  useEffect(() => {
    if (isAdmin) {
      // Mock banner data - replace with actual API call
      const mockBanner: BannerData = {
        id: "1",
        text: "🎉 New Collection Available! Shop now and get 20% off on your first order",
        link: "/browse?new=true",
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setBanner(mockBanner)
      setEditForm({
        text: mockBanner.text,
        link: mockBanner.link || "",
        backgroundColor: mockBanner.backgroundColor,
        textColor: mockBanner.textColor
      })
    }
  }, [isAdmin])

  const handleSave = async () => {
    if (!banner) return

    try {
      // Mock save - replace with actual API call
      const updatedBanner = {
        ...banner,
        text: editForm.text,
        link: editForm.link,
        backgroundColor: editForm.backgroundColor,
        textColor: editForm.textColor,
        updatedAt: new Date().toISOString()
      }
      
      setBanner(updatedBanner)
      setIsEditing(false)
      
      // Show success message
      console.log("Banner updated successfully!")
    } catch (error) {
      console.error("Error updating banner:", error)
    }
  }

  const handleDelete = async () => {
    if (!banner) return

    try {
      // Mock delete - replace with actual API call
      setBanner(null)
      setIsVisible(false)
      
      console.log("Banner deleted successfully!")
    } catch (error) {
      console.error("Error deleting banner:", error)
    }
  }

  const handleToggleVisibility = async () => {
    if (!banner) return

    try {
      // Mock toggle - replace with actual API call
      const updatedBanner = {
        ...banner,
        isActive: !banner.isActive,
        updatedAt: new Date().toISOString()
      }
      
      setBanner(updatedBanner)
      setIsVisible(updatedBanner.isActive)
      
      console.log("Banner visibility toggled!")
    } catch (error) {
      console.error("Error toggling banner visibility:", error)
    }
  }

  // Don't render if not admin or no banner
  if (!isAdmin || !banner || !isVisible) {
    return null
  }

  return (
    <div 
      className="relative w-full py-3 px-4 text-center transition-all duration-300"
      style={{
        backgroundColor: editForm.backgroundColor,
        color: editForm.textColor
      }}
    >
      {/* Admin Controls */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
        {isEditing ? (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-white/20"
              onClick={handleSave}
            >
              <Save className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-white/20"
              onClick={() => setIsEditing(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-white/20"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-white/20"
              onClick={handleToggleVisibility}
            >
              {banner.isActive ? "👁️" : "👁️‍🗨️"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-white/20"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>

      {/* Banner Content */}
      <div className="container mx-auto">
        {isEditing ? (
          <div className="flex flex-col md:flex-row items-center gap-4 max-w-4xl mx-auto">
            <Input
              value={editForm.text}
              onChange={(e) => setEditForm(prev => ({ ...prev, text: e.target.value }))}
              className="flex-1 bg-white/20 border-white/30 text-white placeholder-white/70"
              placeholder="Banner text..."
            />
            <Input
              value={editForm.link}
              onChange={(e) => setEditForm(prev => ({ ...prev, link: e.target.value }))}
              className="w-full md:w-48 bg-white/20 border-white/30 text-white placeholder-white/70"
              placeholder="Link (optional)..."
            />
            <div className="flex items-center gap-2">
              <Input
                type="color"
                value={editForm.backgroundColor}
                onChange={(e) => setEditForm(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-12 h-8 border-white/30"
              />
              <Input
                type="color"
                value={editForm.textColor}
                onChange={(e) => setEditForm(prev => ({ ...prev, textColor: e.target.value }))}
                className="w-12 h-8 border-white/30"
              />
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-slide">
            {banner.link ? (
              <a 
                href={banner.link}
                className="inline-block hover:opacity-80 transition-opacity duration-300"
              >
                <span className="text-sm md:text-base font-medium">
                  {banner.text}
                </span>
              </a>
            ) : (
              <span className="text-sm md:text-base font-medium">
                {banner.text}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
