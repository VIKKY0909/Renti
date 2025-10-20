"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { getAllFAQs } from "@/lib/actions/admin"
import { SkeletonLoader } from "@/components/ui/skeleton-loader"

export function AdminContent() {
  const [faqs, setFAQs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFAQs() {
      try {
        const { faqs: data, error } = await getAllFAQs()
        if (error) {
          console.error("Error fetching FAQs:", error)
        } else {
          setFAQs(data || [])
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-4xl font-bold mb-2">Content Management</h1>
          <p className="text-muted-foreground">Manage testimonials and FAQs</p>
        </div>
        <SkeletonLoader type="grid" count={4} />
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">Content Management</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage testimonials and FAQs</p>
      </div>

      <Tabs defaultValue="faqs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="faqs" className="text-xs sm:text-sm">FAQs</TabsTrigger>
          <TabsTrigger value="testimonials" className="text-xs sm:text-sm">Testimonials</TabsTrigger>
        </TabsList>

        <TabsContent value="faqs" className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">Frequently Asked Questions</h2>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </Button>
          </div>

          {faqs.length === 0 ? (
            <div className="text-center py-12 sm:py-20">
              <p className="text-sm sm:text-base text-muted-foreground">No FAQs found. Add some to get started.</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq) => (
                <div key={faq.id} className="bg-card rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg mb-2">{faq.question}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-2">{faq.answer}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs bg-muted px-2 py-1 rounded">{faq.category}</span>
                        <span className="text-xs text-muted-foreground">Order: {faq.order_index}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          faq.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {faq.is_published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center sm:justify-start">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline ml-1">Edit</span>
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive text-xs sm:text-sm">
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline ml-1">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">Customer Testimonials</h2>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </div>

          <div className="text-center py-12 sm:py-20">
            <p className="text-sm sm:text-base text-muted-foreground">Testimonials management coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}