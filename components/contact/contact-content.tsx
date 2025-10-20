"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2, Heart, Sparkles, Star, MessageCircle, Users, Shield, Zap } from "lucide-react"

export default function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Capture additional client-side data
      const additionalData = {
        ...formData,
        // Browser and device info
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: new Date().toISOString()
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(additionalData),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setFormData({ name: "", email: "", subject: "", message: "" })
        
        // Reset success state after 5 seconds
        setTimeout(() => {
          setIsSuccess(false)
        }, 5000)
      } else {
        setError(result.error || "Failed to send message. Please try again.")
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <Heart className="h-4 w-4" />
              We're here to help you shine
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-fade-in-up">
              Let's Connect
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              Have questions about our designer rentals? Need styling advice? 
              We're your fashion partners, ready to make your special moments unforgettable.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Expert Styling</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Secure & Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Quick Response</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information - Elegant Cards */}
            <div className="lg:col-span-1 space-y-6">
              <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Choose your preferred way to reach us
                </p>
              </div>

              {/* Phone Card */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                      <a href="tel:+917724023688" className="text-primary font-medium text-lg hover:underline">
                        +91 7724023688
                      </a>
                      <p className="text-sm text-muted-foreground mt-2">
                        Available 9 AM - 8 PM, Monday to Saturday
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email Card */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-secondary/5 to-secondary/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/20 rounded-xl group-hover:bg-secondary/30 transition-colors">
                      <Mail className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                      <a href="mailto:contactrentimade@gmail.com" className="text-foreground font-medium text-lg hover:underline">
                        contactrentimade@gmail.com
                      </a>
                      <p className="text-sm text-muted-foreground mt-2">
                        We respond within 2-4 hours during business hours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Card */}
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-accent/5 to-accent/10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/20 rounded-xl group-hover:bg-accent/30 transition-colors">
                      <MapPin className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                      <p className="font-medium text-lg">Indore, Madhya Pradesh</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        By appointment only. Please call to schedule a visit.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="border-0 bg-gradient-to-br from-muted/50 to-muted/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-xl">
                      <Clock className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-4">Business Hours</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Monday - Friday</span>
                          <span className="font-medium">9:00 AM - 8:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Saturday</span>
                          <span className="font-medium">10:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sunday</span>
                          <span className="font-medium text-muted-foreground">Closed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form - Elegant Design */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-background to-muted/20">
                <CardHeader className="text-center pb-8">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
                    <MessageCircle className="h-4 w-4" />
                    Send us a message
                  </div>
                  <CardTitle className="text-3xl font-bold">We'd love to hear from you</CardTitle>
                  <CardDescription className="text-lg">
                    Tell us about your special occasion and let us help you find the perfect outfit
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Success Animation */}
                  {isSuccess && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl animate-in slide-in-from-top-2 duration-500">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="h-6 w-6 text-green-600 animate-pulse" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green-800 mb-1">
                            Message sent successfully! ✨
                          </h3>
                          <p className="text-green-700">
                            Thank you for reaching out! We'll get back to you within 24 hours with styling recommendations.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl animate-in slide-in-from-top-2 duration-500">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-red-100 rounded-full">
                            <span className="text-red-600 text-lg font-bold">!</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-red-800 mb-1">
                            Oops! Something went wrong
                          </h3>
                          <p className="text-red-700">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-semibold text-foreground">
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          placeholder="Your beautiful name"
                          className={`h-12 text-base ${isSuccess ? "bg-green-50 border-green-200" : ""}`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          placeholder="your.email@example.com"
                          className={`h-12 text-base ${isSuccess ? "bg-green-50 border-green-200" : ""}`}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-semibold text-foreground">
                        What's this about? *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Wedding, party, special event..."
                        className={`h-12 text-base ${isSuccess ? "bg-green-50 border-green-200" : ""}`}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-semibold text-foreground">
                        Tell us more *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        placeholder="Share your vision, event details, or any questions you have. We're here to help you look absolutely stunning!"
                        rows={6}
                        className={`text-base resize-none ${isSuccess ? "bg-green-50 border-green-200" : ""}`}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 text-lg font-semibold relative overflow-hidden group"
                      disabled={isSubmitting || isSuccess}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                          Sending your message...
                        </>
                      ) : isSuccess ? (
                        <>
                          <CheckCircle className="h-5 w-5 mr-3" />
                          Message sent! ✨
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform" />
                          Send Message
                        </>
                      )}
                      
                      {/* Animated background for success state */}
                      {isSuccess && (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse opacity-20" />
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* FAQ Section - Elegant Design */}
          <div className="mt-24">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                Common Questions
              </div>
              <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about our rental service
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">How does the rental process work?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Browse our curated collection, select your dream outfit, choose your rental duration, 
                        and we'll deliver it to your doorstep. After your special event, simply return it 
                        and we'll handle all the cleaning and care.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-secondary/5 to-secondary/10">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-secondary/20 rounded-xl group-hover:bg-secondary/30 transition-colors">
                      <Heart className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">What if the outfit doesn't fit perfectly?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        We provide detailed size charts and measurements for every outfit. If something 
                        doesn't fit perfectly, contact us immediately and we'll arrange a replacement 
                        or full refund - your satisfaction is our priority.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-accent/5 to-accent/10">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-accent/20 rounded-xl group-hover:bg-accent/30 transition-colors">
                      <Zap className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">How do I return the outfit?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Simply pack the outfit in the provided premium bag and schedule a pickup. 
                        We'll collect it from your location at the agreed time - it's that simple!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-muted/50 to-muted/30">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-muted rounded-xl group-hover:bg-muted/80 transition-colors">
                      <Shield className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Is there a security deposit?</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Yes, we require a security deposit which is fully refundable upon return 
                        of the outfit in good condition. This helps us maintain our premium collection.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
