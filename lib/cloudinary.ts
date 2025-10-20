import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export { cloudinary }

// Helper function to upload image
export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'rentimade/banners',
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
    })

    return result.secure_url
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw new Error('Failed to upload image')
  }
}

// Helper function to delete image
export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return false
  }
}

// Helper function to get public ID from URL
export function getPublicIdFromUrl(url: string): string {
  const parts = url.split('/')
  const filename = parts[parts.length - 1]
  const publicId = filename.split('.')[0]
  return `rentimade/banners/${publicId}`
}
