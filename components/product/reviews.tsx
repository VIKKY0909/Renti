"use client"

import { useState, useEffect } from "react"
import { Star, ThumbsUp, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { getProductReviews } from "@/lib/actions/reviews"
import { formatDate } from "@/lib/utils"

interface ReviewsProps {
  productId: string
  rating: number
  totalReviews: number
}

export function Reviews({ productId, rating, totalReviews }: ReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const { reviews: data, error } = await getProductReviews(productId)
        if (error) {
          console.error("Error fetching reviews:", error)
        } else {
          setReviews(data || [])
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [productId])

  // Calculate rating distribution from actual reviews
  const ratingDistribution = [
    { stars: 5, percentage: Math.round((reviews.filter(r => r.rating === 5).length / Math.max(reviews.length, 1)) * 100) },
    { stars: 4, percentage: Math.round((reviews.filter(r => r.rating === 4).length / Math.max(reviews.length, 1)) * 100) },
    { stars: 3, percentage: Math.round((reviews.filter(r => r.rating === 3).length / Math.max(reviews.length, 1)) * 100) },
    { stars: 2, percentage: Math.round((reviews.filter(r => r.rating === 2).length / Math.max(reviews.length, 1)) * 100) },
    { stars: 1, percentage: Math.round((reviews.filter(r => r.rating === 1).length / Math.max(reviews.length, 1)) * 100) },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold">{rating.toFixed(1)}</div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{totalReviews} reviews</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {ratingDistribution.map((dist) => (
            <div key={dist.stars} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium">{dist.stars}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
              </div>
              <Progress value={dist.percentage} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-12">{dist.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        
        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <Star className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2">No reviews yet</h3>
            <p className="text-muted-foreground">Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.user?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>
                      {review.user?.full_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user?.full_name || "Anonymous"}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
                    </div>

                    <p className="text-sm leading-relaxed">{review.comment}</p>

                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        Helpful
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}