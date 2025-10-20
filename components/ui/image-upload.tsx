"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  className?: string
  disabled?: boolean
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 5, 
  className,
  disabled = false 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newFiles = Array.from(files).slice(0, maxImages - images.length)
    if (newFiles.length === 0) return

    setIsUploading(true)

    try {
      const uploadPromises = newFiles.map(async (file) => {
        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if (!allowedTypes.includes(file.type)) {
          throw new Error(`Invalid file type: ${file.type}`)
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
          throw new Error(`File too large: ${file.name}`)
        }

        // Upload to Cloudinary via API
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Upload failed")
        }

        const { url } = await response.json()
        return url
      })

      const uploadedImages = await Promise.all(uploadPromises)
      onImagesChange([...images, ...uploadedImages])
    } catch (error) {
      console.error("Error uploading images:", error)
      // You might want to show a toast notification here
      alert(`Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsUploading(false)
    }
  }, [images, onImagesChange, maxImages])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (disabled) return
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect, disabled])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const openFileDialog = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Label>Images ({images.length}/{maxImages})</Label>
      
      {/* Upload Area */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={cn(
          "border-2 border-dashed border-border rounded-lg p-6 text-center transition-colors",
          "hover:border-primary/50 cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          isUploading && "border-primary"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={(e) => {
          e.stopPropagation()
          openFileDialog()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            openFileDialog()
          }
        }}
      >
        <div className="flex flex-col items-center space-y-2 pointer-events-none">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <div className="text-sm text-muted-foreground">
            {isUploading ? "Uploading..." : "Click to upload or drag and drop"}
          </div>
          <div className="text-xs text-muted-foreground">
            PNG, JPG, WEBP up to 5MB each
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden border border-border">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
                disabled={disabled}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Add More Button */}
      {images.length < maxImages && (
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            openFileDialog()
          }}
          disabled={disabled || isUploading}
          className="w-full"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Add More Images ({images.length}/{maxImages})
        </Button>
      )}
    </div>
  )
}
